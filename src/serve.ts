import express from "express";

import userRouter from "./modules/users/routers/user.router";

import EmployeeRouters from "./modules/employee/routers/employee.router";
import ClientRoutes from "./modules/clients/routers/client.router";
import BalanceRouter from "./modules/balance/routers/balance.router";

import empresaRouter from "./modules/empresas/routers/empresa.router";

const app = express();
app.use(express.json());

app.use("/", userRouter);
app.use("/", empresaRouter);

app.use("/employee", EmployeeRouters());
app.use("/client", ClientRoutes());
app.use("/balance", BalanceRouter());

const port = 3000;
export const initServe = () => {
  app.listen(port, () => {
    console.log(`Servidor iniciando: http://localhost:${port}`);
  });
};
