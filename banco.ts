import * as dotenv from "dotenv";
dotenv.config();

import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    process.env.NODE_ENV === "production"
      ? "dist/src/modules/**/*.entity.js"
      : "src/modules/**/*.entity.ts",
  ],
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
