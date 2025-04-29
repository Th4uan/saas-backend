import { Agreement } from 'src/agreement/entity/agreement.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @Column('text', { array: true })
  nomes: string[];

  @ManyToOne(() => Agreement, (agreement) => agreement.appointments)
  @JoinColumn({ name: 'agreementId' })
  agreement: Agreement;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
