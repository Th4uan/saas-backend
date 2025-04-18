import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { signPdf } from './utils/pdf-signer.utils';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private bucket = process.env.SUPABASE_BUCKET!;

  constructor() {
    this.supabase = new SupabaseClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
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
}
