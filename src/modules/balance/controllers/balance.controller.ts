import { Request, Response } from "express";

import { AppDataSource } from "../../../../banco";
import { Balance } from "../entities/balance.entity";
import { Client } from "../../clients/entities/client.entity";
import { Employee } from "../../employee/entities/employee.entity";

const repository = AppDataSource.getRepository(Balance);

export default new class BalaceController {
    async createBalace(req: Request, res: Response) {
        const now = new Date();
        const date = now.toLocaleDateString("pt-BR", {day: "2-digit", month: "2-digit", year: "numeric"});
        const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: "2-digit" });

        const {
            company, transactionType,
            totalSpent, cashbackPercentage,
            cashbackReceived, cliendID, employeeID
        } = req.body;

        try {
            const client = await AppDataSource.getRepository(Client).findOne({where: {client_id: cliendID}});
            const employee = await AppDataSource.getRepository(Employee).findOne({where: {employee_id: employeeID}});

            if(!client || !employee) {
                return res.status(404).json({
                    ok: false,
                    message: "Client or Employee not found!"
                });
            }

            const balance = await repository.save({
                date, time, company, transactionType,
                totalSpent, cashbackPercentage, cashbackReceived,
                client, employee
            });
            return res.status(201).json({
                ok: true,
                message: "balance create.",
                balance
            });
        }catch(error) {
            console.error(error);
            return res.status(500).json({
                ok: false,
                message: "Error"
            });
        }
    }

    async getAllBalance(req: Request, res: Response) {
        try {
            const balances = await repository.find({relations: ["client", "employee"]});

            if(!balances) return res.status(404).json({
                ok: false,
                message: "Balances not found!"
            });

            return res.status(200).json({
                ok: true,
                balances
            });
        }catch(error){
            console.error(error);
            return res.status(500).json({
                ok: false,
                message: "Erro trying to list balance"
            });
        }


    }

    async searchBalance(req: Request, res: Response) {
        const {cpf, phone, email, time, date, company, transactionType} = req.body;
        
        try {
            const balances = await repository.createQueryBuilder("balance")
            .leftJoinAndSelect("balance.client", "client")
            .leftJoinAndSelect("balance.employee", "employee")

            if(cpf) balances.andWhere("client.cpf = :cpf", {cpf});
            if(phone) balances.andWhere("client.phone = :phone OR employee.phone = :phone", {phone});
            if(email) balances.andWhere("employee.email = :email", {email});
            if(time) balances.andWhere("balance.time = :time", {time});
            if(date) balances.andWhere("balance.date = :date", {date});
            if(company) balances.andWhere("balance.company = :company", {company});
            if(transactionType) balances.andWhere("balance.transactionType = :transactionType", {transactionType});

            const balance = await balances.getMany();
            return res.status(200).json({
                ok: true,
                balance
            });
        }catch(error){
            console.error(error);
            return res.status(500).json({
                ok: false,
                message: "balance not found!"
            });
        }
    }
}