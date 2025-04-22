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

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private bucket = process.env.SUPABASE_BUCKET!;

  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesRepository: Repository<FilesEntity>,
    private readonly clientService: ClientsService,
    private readonly servicesService: ServicesService,
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
    pfxBuffer: Express.Multer.File,
    password: string,
    fileDto: FileDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!pfxBuffer) {
      throw new BadRequestException('No PFX file provided');
    }

    if (password == '' || password == null || !password) {
      throw new BadRequestException('No password provided');
    }

    const signedPdf = await signPdf(file.buffer, pfxBuffer.buffer, password);

    if (!signedPdf) {
      throw new BadRequestException('Error signing PDF');
    }

    const result = await this.saveDatabaseFile(file, fileDto, true);

    if (!result) {
      throw new BadRequestException('Error saving file to database');
    }

    const filePath = `${this.bucket}/${file.originalname}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, signedPdf, {
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
