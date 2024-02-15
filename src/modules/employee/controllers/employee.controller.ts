import { Request, Response } from "express";
import * as bcrypt from "bcrypt";

import { AppDataSource } from "../../../../banco";
import { Employee } from "../entities/employee.entity";

const messages = {
    "EMPLOYEE_ALREADY_REGISTERED": "Employee is already registered.",
    "ERROR_CREATING": "Error trying to create.",
    "NOT_FOUND": "Not found.",
    "ERROR_LISTING_EMPLOYEES": "Error trying to list employees.",
    "ERROR_UPDATING": "Error trying to update.",
    "ERROR_DELETING": "Error trying to delete.",
    "SUCCESS_CREATING": "Successfully created.",
    "SUCCESS_UPDATING": "Successfully updated.",
    "SUCCESS_DELETING": "Successfully deleted.",
    "SUCCESS_LISTING_EMPLOYEES": "Successfully listed all employees.",
    "SUCCESS_FOUND_EMPLOYEE": "Successfully found the employee.",
};

const respository = AppDataSource.getRepository(Employee);
export default new class EmployeeController {
    async createEmployee(req: Request, res: Response){
        const { name, password, email, phone, functions, balance} = req.body;
        try {
            const exists = await (async function(email, phone) {
                return (await Promise.race([ 
                    respository.findOneBy({email}),
                    respository.findOneBy({phone})
                ]));

            })(email, phone);

            if(exists){
                return res.status(400).json({
                    ok: false, 
                    error: messages.EMPLOYEE_ALREADY_REGISTERED
                });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            await respository.save({
                name, 
                password: passwordHash, 
                email, 
                phone, 
                functions,
                balance
            });

        }catch(error){
            console.error(error);
            return res.status(500).json({
                ok: false, 
                error: messages.ERROR_CREATING
            });
        }
    }

    async getAllEmployee(req: Request, res: Response){
        try {
            const employees = await respository.find();
            
            if(!employees) return res.status(404).json({
                ok: false, error: messages.NOT_FOUND
            });
            
            return res.status(200).json({
                ok: true, message: messages.SUCCESS_LISTING_EMPLOYEES, employees
            });

        } catch(error){
            console.error(error);
            return res.status(500).json({
                ok: false, 
                error: messages.ERROR_LISTING_EMPLOYEES
            });
        }
    }

    async updateEmployee(req: Request, res: Response){
        const {id} = req.params;
        const {name, password, email, phone, functions, balance} = req.body;

        try {
            const employee = await respository.findOne({where: {employee_id: +id}});

            if(!employee) return res.status(404).json({
                ok: false, error: messages.NOT_FOUND
            });

            if(name) employee.name = name;
            if(password) employee.password = await bcrypt.hash(password, 10);
            if(email) employee.email = email;
            if(phone) employee.phone = phone;
            if(functions) employee.functions = functions;
            if(balance) employee.balance = balance;

            await respository.save(employee);
            return res.status(200).json({
                ok: true,
                message: messages.SUCCESS_UPDATING
            });
        }catch(error){
            console.error(error);
            return res.status(500).json({
                ok: false,
                message: messages.ERROR_UPDATING
            });
        }
    }

    async deleteEmployee(req: Request, res: Response) {
        const { id } = req.params;
    
        try {
          const employee = await respository.findOne({ where: { employee_id: +id }});
    
          if (!employee) {
            return res.status(404).json({ ok: false, error: messages.NOT_FOUND });
          }
          await respository.softRemove(employee);
    
          return res
            .status(200)
            .json({ ok: true, message: messages.SUCCESS_DELETING});
        } catch (error) {
          console.error(error);
          res.status(500).send({ ok: false, error: messages.ERROR_DELETING});
        }
      }
}