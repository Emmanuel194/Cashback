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

@Entity("employee")
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id: number;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  functions: string;

  @OneToMany(() => Balance, (balance) => balance.client)
  balances: Balance[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
