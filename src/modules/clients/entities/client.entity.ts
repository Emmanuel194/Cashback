import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from "typeorm";

import { Balance } from "../../balance/entities/balance.entity";

@Entity("clients")
export class Client {
    @PrimaryGeneratedColumn()
    client_id: number;

    @Column()
    name: string;

    @Column({unique: true, select: false})
    cpf: string;

    @Column({unique: true})
    phone: string;

    @OneToMany(() => Balance, (balance) => balance.client)
    balances: Balance[];

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @DeleteDateColumn()
    deleted_at: Date;
}