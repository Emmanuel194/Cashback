import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";

import { Balance } from "../../balance/entities/balance.entity";

@Entity("empresas")
export class Empresa {
  @PrimaryGeneratedColumn()
  empresa_id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  endereco?: string;

  @Column({ nullable: true })
  cnpj?: string;

  @Column()
  percentual_cashback: number;

  @OneToMany(() => Balance, (balance) => balance.empresa)
  balances: Balance[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
