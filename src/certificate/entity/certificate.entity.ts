import {
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
