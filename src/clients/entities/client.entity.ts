import { Address } from 'src/address/entities/address.entity';
import {
  Column,
  CreateDateColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CivilStatusEnum } from '../enum/civil-status.enum';

export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @ManyToMany(() => Address, (address) => address.id)
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
