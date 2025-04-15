import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from './supabase.service';

@Controller('database')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const data = await this.supabaseService.uploadFile(file);
    return {
      message: 'File uploaded successfully',
      data,
    };
  }

  @Post('download/:fileName')
  async downloadFile(@Param('fileName') fileName: string) {
    const data = await this.supabaseService.downloadFile(fileName);
    return {
      message: 'File downloaded successfully',
      data,
    };
  }
}
