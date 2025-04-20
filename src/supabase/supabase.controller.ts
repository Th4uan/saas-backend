import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from './supabase.service';
import { PasswordDto } from './dto/password.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@ApiTags('documents')
@UseGuards(AuthTokenGuard)
@ApiCookieAuth('jwt')
@Controller('documents')
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
  @UseInterceptors(FilesInterceptor('files', 2))
  async signUpload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() password: PasswordDto,
  ) {
    if (files.length !== 2) {
      throw new BadRequestException(
        'Please upload exactly two files: the PDF and the PFX file',
      );
    }

    const [pdfFile, pfxFile] = files;

    if (!pdfFile || !pfxFile) {
      throw new BadRequestException('Invalid files');
    }

    const signedPdf = await this.supabaseService.signUpload(
      pdfFile,
      pfxFile,
      password.password,
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
