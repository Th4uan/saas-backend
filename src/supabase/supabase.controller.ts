import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from './supabase.service';
import { FileExpecsDto } from './dto/file-expecs.dto';
import { FileDto } from './dto/file.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('documents')
@Controller('documents')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileDto: FileDto,
  ) {
    const data = await this.supabaseService.uploadFile(file, fileDto);
    return {
      message: 'File uploaded successfully',
      data,
    };
  }

  @Get('download/:fileName')
  async downloadFile(@Param('fileName') fileName: string) {
    const data = await this.supabaseService.downloadFile(fileName);
    return {
      message: 'File downloaded successfully',
      data,
    };
  }

  @Get('view/:fileName')
  viewFile(@Param('fileName') fileName: string) {
    const data = this.supabaseService.viewFile(fileName);
    return {
      message: 'File viewed successfully',
      data,
    };
  }

  @Post('sign/upload')
  @UseInterceptors(FileInterceptor('file'))
  async signUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() password: FileExpecsDto,
  ) {
    const fileExpecs: FileDto = {
      clientId: password.clientId,
      serviceId: password.serviceId,
      doctorId: password.doctorId,
    };

    const signedPdf = await this.supabaseService.signUpload(
      file,
      password.certificateId,
      fileExpecs,
    );

    return {
      message: 'File signed and save sucessfully',
      data: signedPdf,
    };
  }

  @Delete('delete/:fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    const data = await this.supabaseService.deleteFile(fileName);
    return {
      message: 'File deleted successfully',
      data,
    };
  }
}
