import { Injectable } from '@nestjs/common';
// import { CreateReportDto } from './dto/create-report.dto';
@Injectable()
export class ReportsService {
  // create(createReportDto: CreateReportDto) {
  //   return 'This action adds a new report';
  // }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }
}
