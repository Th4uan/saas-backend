import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from '../enums/user-role.enum';
import { Service } from 'src/services/entities/service.entity';
import { DisponibilityEnum } from '../enums/disponibility.enum';
import { CertificateEntity } from 'src/certificate/entity/certificate.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ enum: UserRoleEnum })
  role: UserRoleEnum;

  @Column({ enum: DisponibilityEnum, default: DisponibilityEnum.INDISPONIVEL })
  disponibility: DisponibilityEnum;

  @Column()
  password: string;

  @OneToMany(() => Service, (service) => service.doctor)
  services: Service[];

  @OneToMany(() => CertificateEntity, (certificate) => certificate.doctorId)
  certificates: CertificateEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
