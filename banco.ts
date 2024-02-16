import * as dotenv from "dotenv";
dotenv.config();

import User from "./src/modules/users/entities/user.entity";

import { Employee } from "./src/modules/employee/entities/employee.entity";
import { Client } from "./src/modules/clients/entities/client.entity";
import { Balance } from "./src/modules/balance/entities/balance.entity";

import { Empresa } from "./src/modules/empresas/entities/empresas.entity";

import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Employee, Client, Balance, Empresa],
  synchronize: true,
});

export async function startDataBase() {
  try {
    await AppDataSource.initialize();
    console.log(`Banco de dados inicializado`);
  } catch (error) {
    console.log(error, "Error ao inicializar aplicativo");
  }
}
