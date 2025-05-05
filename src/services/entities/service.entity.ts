import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceStatusEnum } from '../enum/service-status.enum';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/user/entities/user.entity';
import { FilesEntity } from 'src/supabase/entities/files.entity';
import { Payment } from 'src/payment/entity/payment.entity';
import { TypeService } from '../enum/type-service..enum';
import { RecurrenceEnum } from '../enum/recurrence.enum';

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

  @Column({ enum: ServiceStatusEnum, default: ServiceStatusEnum.EM_FILA })
  status: ServiceStatusEnum;

  @Column()
  typeService: TypeService; // -> trocar para enum

  @Column()
  recurrence: RecurrenceEnum;

  @ManyToOne(() => Payment, (payment) => payment.service)
  @JoinColumn({ name: 'payment_id' })
  payments: Payment;

  @OneToMany(() => FilesEntity, (file) => file.service)
  files: FilesEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
