import { Address } from 'src/address/entities/address.entity';
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
import { CivilStatusEnum } from '../enum/civil-status.enum';
import { Service } from 'src/services/entities/service.entity';
import { FilesEntity } from 'src/supabase/entities/files.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @ManyToOne(() => Address, (address) => address.client)
  @JoinColumn({ name: 'address_id' })
  address: Address;

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
