import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceStatusEnum } from '../enum/service-status.enum';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @Column()
  doctorId: string;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column({ enum: ServiceStatusEnum })
  status: ServiceStatusEnum;

  @Column()
  typeService: string;
}
