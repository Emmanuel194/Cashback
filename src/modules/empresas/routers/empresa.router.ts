import { Router } from "express";
import { EmpresaController } from "./empresa.controller.ts";

const empresaRouter = Router();
const empresaController = new EmpresaController();

empresaRouter.get("/", empresaController.getAllEmpresas);
empresaRouter.get("/:id", empresaController.getEmpresaById);
empresaRouter.post("/", empresaController.createEmpresa);
empresaRouter.put("/:id", empresaController.updateEmpresa);
empresaRouter.delete("/:id", empresaController.deleteEmpresa);

export default empresaRouter;
