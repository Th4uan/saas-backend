import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { signPdf } from './utils/pdf-signer.utils';
import { FileDto } from './dto/file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesEntity } from './entities/files.entity';
import { Repository } from 'typeorm';
import { ClientsService } from 'src/clients/clients.service';
import { ServicesService } from 'src/services/services.service';
import { CertificateService } from 'src/certificate/certificate.service';
import { StampService } from 'src/stamp/stamp.service';
import { UserService } from 'src/user/user.service';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private bucket = process.env.SUPABASE_BUCKET!;

  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesRepository: Repository<FilesEntity>,
    private readonly clientService: ClientsService,
    private readonly servicesService: ServicesService,
    private readonly certificateService: CertificateService,
    private readonly stampService: StampService,
    private readonly doctorService: UserService,
  ) {
    this.supabase = new SupabaseClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );
  }

  async uploadFile(file: Express.Multer.File, fileDto: FileDto) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.saveDatabaseFile(file, fileDto, false);

    if (!result) {
      throw new BadRequestException('Error saving file to database');
    }

    const filePath = `${this.bucket}/${file.originalname}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.log(error);
      throw new BadRequestException('Error uploading file');
    }

    return data;
  }

  async downloadFile(fileName: string) {
    if (fileName == '' || fileName == null) {
      throw new BadRequestException('file name is null or empty');
    }

    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .download(`${this.bucket}/${fileName}`);

    if (error) {
      console.log(error);
      throw new NotFoundException('File not found');
    }

    const arrayBuffer = await data.arrayBuffer();

    return Buffer.from(arrayBuffer);
  }

  viewFile(fileName: string) {
    if (fileName == '' || fileName == null) {
      throw new BadRequestException('file name is null or empty');
    }

    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(`${this.bucket}/${fileName}`);

    if (!data) {
      throw new NotFoundException('File not found');
    }
    return data.publicUrl;
  }

  async signUpload(
    file: Express.Multer.File,
    pfxBufferId: string,
    fileDto: FileDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const pfxBuffer =
      await this.certificateService.getCertificateById(pfxBufferId);

    if (!pfxBuffer) {
      throw new BadRequestException('No PFX file provided');
    }

    const password = pfxBuffer.password;

    if (!password) {
      throw new BadRequestException('No password provided');
    }

    const doctor = await this.doctorService.findUserById(fileDto.doctorId);

    const client = await this.clientService.findOneClientEntity(
      fileDto.clientId,
    );

    if (!doctor || doctor.role != UserRoleEnum.Doctor) {
      throw new BadRequestException('No doctor provided');
    }

    const signedPdf = signPdf(file.buffer, pfxBuffer.certificate, password);

    if (!signedPdf) {
      throw new BadRequestException('Error signing PDF');
    }

    const stampedBuffer = await this.stampService.aplicarCarimboBufferNoPDF(
      signedPdf,
      doctor,
      client,
    );

    const result = await this.saveDatabaseFile(file, fileDto, true);

    if (!result) {
      throw new BadRequestException('Error saving file to database');
    }

    const filePath = `${this.bucket}/${file.originalname}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, stampedBuffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.log(error);
      throw new BadRequestException('Error uploading file');
    }

    return data;
  }

  async deleteFile(fileName: string) {
    if (fileName == '' || fileName == null) {
      throw new BadRequestException('file name is null or empty');
    }

    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .remove([`${this.bucket}/${fileName}`]);

    if (error) {
      console.log(error);
      throw new NotFoundException('File not found');
    }

    return data;
  }

  private async saveDatabaseFile(
    file: Express.Multer.File,
    fileDto: FileDto,
    assined: boolean,
  ): Promise<boolean> {
    let status = false;

    if (!fileDto) {
      throw new BadRequestException('No fileDto provided');
    }

    const data = {
      name: file.originalname,
      isAssined: assined,
      service: await this.servicesService.findOneServiceEntity(
        fileDto.serviceId,
      ),
      client: await this.clientService.findOneClientEntity(fileDto.clientId),
    };

    const fileEntity = this.filesRepository.create(data);

    if (!fileEntity) {
      throw new BadRequestException('Error creating file entity');
    }

    await this.filesRepository.save(fileEntity);

    status = true;

    return status;
  }
}
