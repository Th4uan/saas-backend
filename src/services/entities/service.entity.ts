import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceStatusEnum } from '../enum/service-status.enum';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.services)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => User, (user) => user.services)
  @JoinColumn({ name: 'doctor_id' })
  doctor: User;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column({ enum: ServiceStatusEnum })
  status: ServiceStatusEnum;

  @Column()
  typeService: string;
}
