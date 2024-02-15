import { Request, Response } from "express";

import { AppDataSource } from "../../../../banco";
import { Client } from "../entities/client.entity";

const repository = AppDataSource.getRepository(Client);

export default new class ClientController {
    async createClient(req: Request, res: Response) {
        const {name, cpf, phone} = req.body;

        const [cpfExists, phoneExists] = await Promise.all([
            repository.findOneBy({cpf}),
            repository.findOneBy({phone}),
        ]);

        if(cpfExists || phoneExists) {
            return res.status(400).json({
                ok: false,
                message: "Client is already registered."
            });
        }

        try {
            const client = await repository.save({
                name, cpf, phone
            });
            return res.status(201).json({
                ok: true,
                message: "customer successfully registered.",
                client
            });
        }catch(error){
            console.error(error);
            return res.status(500).json({
                ok: false,
                message: "Error trying to create client."
            });
        }
    }

    async getAllClient(req: Request, res: Response) {
        try {
            const clients = await repository.find();

            if(!clients){
                return res.status(404).json({
                    ok: false,
                    message: "Clients not found!"
                });
            }

            return res.status(200).json({
                ok: true,
                clients
            });
        }catch(error){
            console.error(error);
            return res.status(500).json({
                ok: false,
                message: "Error trying to list clients"
            });
        }
    }

    async findClient(req: Request, res: Response) {
        const {cpf, phone} = req.body;
        const query = repository.createQueryBuilder("clients");

        try {
            if(cpf) query.andWhere("clients.cpf = :cpf", {cpf});
            if(phone) query.andWhere("clients.phone = :phone", {phone});
            const client = await query.getMany();
            
            if(!client) {
                return res.status(404).json({
                    ok: false,
                    message: "Client not found!"
                });
            }
            return res.status(200).json({
                ok: true, client
            });
        }catch(error){
            console.error(error);
            return res.status(500).json({
                ok: false,
                message: "Error trying to find the client"
            });
        }
    }

    async updateClient(req: Request, res: Response) {
        const {id} = req.params;
        const {name, phone} = req.body;

        try {
            const client = await repository.findOne({
                where: {client_id: +id}
            });

            if(!client) {
                return res.status(404).json({
                    ok: false,
                    message: "Client not found!"
                });
            }

            if(name) client.name = name;
            if(phone) client.phone = phone;
            await repository.save(client);
            return res.status(200).json({
                ok: true,
                message: "updated customer information."
            });
        }catch(error){
            console.error(error);
            return res.status(500).json({
                ok: false,
                message: "Error updating client."
            });
        }
    }

    async deleteClient(req: Request, res: Response){
        const {id} = req.params;

        try {
            const client = await repository.findOne({
                where: {client_id: +id}
            });

            if(!client) {
                return res.status(404).json({
                    ok: false,
                    message: "Client not found!"
                });
            }
            
            await repository.softRemove(client);
            return res.status(200).json({
                ok: true,
                message: "Client successfully deleted."
            });
        }catch(error){
            console.error(error);
            return res.status(500).json({
                ok: false,
                message: "Error deleting beneficiary."
            });
        }
    }
}
