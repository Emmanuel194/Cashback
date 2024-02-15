import express from "express";
import { Request, Response } from "express";
import userRouter from "./modules/users/routers/user.router";

import EmployeeRouters from "./modules/employee/routers/employee.router";
import ClientRoutes from "./modules/clients/routers/client.router";
import BalanceRouter from "./modules/balance/routers/balance.router";

const app = express();
app.use(express.json());

app.use("/", userRouter);

app.use("/employee", EmployeeRouters());
app.use("/client", ClientRoutes());
app.use("/balance", BalanceRouter());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "sucesso!" });
});

const port = 3000;
export const initServe = () => {
  app.listen(port, () => {
    console.log(`Servidor iniciando: http://localhost:${port}`);
  });
};
