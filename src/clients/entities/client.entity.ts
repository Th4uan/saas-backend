import { Address } from 'src/address/entities/address.entity';
import {
  Column,
  CreateDateColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @ManyToMany(() => Address, (address) => address.id)
  address: Address;

  @Column()
  cpf: string;

  @Column()
  phone: string;

  @Column({ type: 'boolean', default: false })
  phoneIsWhatsApp: boolean;

  @Column()
  password: string;

  @Column()
  profission: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
