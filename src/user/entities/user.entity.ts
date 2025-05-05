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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
