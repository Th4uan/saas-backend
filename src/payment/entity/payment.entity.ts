import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { PaymentStatusEnum } from '../enums/payment-status.enum';
import { Service } from 'src/services/entities/service.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: PaymentMethodEnum })
  paymentMethod: PaymentMethodEnum;

  @Column()
  price: number;

  @Column({ enum: PaymentStatusEnum })
  status: PaymentStatusEnum;

  @OneToMany(() => Service, (service) => service.payments)
  service: Service[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
