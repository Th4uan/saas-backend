import { IsDate, IsNotEmpty } from 'class-validator';

export class DateServiceDto {
  @IsNotEmpty()
  @IsDate()
  initDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
