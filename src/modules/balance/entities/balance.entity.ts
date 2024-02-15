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

@Entity("balance")
export class Balance {
    @PrimaryGeneratedColumn()
    balance_id: number;

    @Column({type: 'date'})
    date: Date;

    @Column({type: 'time'})
    time: string

    @Column()
    company: string

    @Column({type: 'enum', enum: ["Debit", "Credit"]})
    transactionType: "Debit" | "Credit"

    @Column({type: 'decimal', precision: 5, scale: 2})
    totalSpent: number

    @Column({type: 'decimal', precision: 5, scale: 2})
    cashbackPercentage: number;

    @Column({type: 'decimal', precision: 5, scale: 2})
    cachbackReceived: number;

    @ManyToOne(() => Client, (client) => client.balances)
    client: Client;

    @ManyToOne(() => Employee, (employee) => employee.balances)
    employee: Employee;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @DeleteDateColumn()
    deleted_at: Date;
}