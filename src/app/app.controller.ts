import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    status: 200,
    description: 'Ping successful',
    type: String,
    example: 'Pong',
  })
  @Get('ping')
  getPing(): string {
    return this.appService.getPong();
  }
}
