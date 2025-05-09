import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CivilStatusEnum } from '../enum/civil-status.enum';
import { Service } from 'src/services/entities/service.entity';
import { FilesEntity } from 'src/supabase/entities/files.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  address: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  phone: string;

  @Column({ type: 'boolean', default: false })
  phoneIsWhatsApp: boolean;

  @Column()
  profission: string;

  @Column({ enum: CivilStatusEnum })
  civilStatus: CivilStatusEnum;

  @Column()
  rg: string;

  @Column()
  birthDate: Date;

  @Column()
  scholarity: string;

  @Column()
  nationality: string;

  @OneToMany(() => Service, (service) => service.client)
  services: Service[];

  @OneToMany(() => FilesEntity, (file) => file.client)
  files: FilesEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
