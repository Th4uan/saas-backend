import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

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
}
