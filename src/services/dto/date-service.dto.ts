import { IsNotEmpty } from 'class-validator';

export class DateServiceDto {
  @IsNotEmpty()
  initDate: Date;

  @IsNotEmpty()
  endDate: Date;
}
