import express from "express";
import { Request, Response } from "express";
import userRouter from "./modules/users/routers/user.router";

import EmployeeRouters from "./modules/employee/routers/employee.router";

const app = express();
app.use(express.json());

app.use("/", userRouter);
app.use("/employee", EmployeeRouters());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "sucesso!" });
});

const port = 3000;
export const initServe = () => {
  app.listen(port, () => {
    console.log(`Servidor iniciando: http://localhost:${port}`);
  });
};
