import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';

import { Client } from '../../clients/entities/client.entity';
import { Employee } from '../../employee/entities/employee.entity';

import { Empresa } from '../../empresas/entities/empresas.entity';

@Entity("balance")
export class Balance {
    @PrimaryGeneratedColumn()
    balance_id: number;

    @Column({type: 'date'})
    date: Date;

    @Column({type: 'time'})
    time: Date;

    @Column()
    company: string

    @Column()
    company_id: number;

    @Column({type: 'enum', enum: ["Debit", "Credit"]})
    transactionType: "Debit" | "Credit"

    @Column({type: 'decimal', precision: 5, scale: 2})
    totalSpent: number

    @Column({type: 'decimal', precision: 5, scale: 2})
    cashbackPercentage: number;

    @Column({type: 'decimal', precision: 5, scale: 2, default: 0})
    cashbackReceived: number;

    @ManyToOne(() => Client, (client) => client.balances)
    client: Client;

    @ManyToOne(() => Employee, (employee) => employee.balances)
    employee: Employee;

    @ManyToOne(() => Empresa, (empresa) => empresa.balances)
    empresa: Empresa;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @DeleteDateColumn()
    deleted_at: Date;
}