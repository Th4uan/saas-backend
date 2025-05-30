import { User } from 'src/user/entities/user.entity';
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
export class CertificateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bytea' })
  certificate: Buffer;

  @Column()
  password: string;

  @Column()
  crm: string;

  @ManyToOne(() => User, (doctor) => doctor.certificates)
  @JoinColumn({ name: 'doctorId' })
  doctorId: User;

  @Column()
  expiredAt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
