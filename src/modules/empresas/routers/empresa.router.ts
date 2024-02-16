import { Router } from "express";
import empresaController from "../controllers/empresa.controller";


const empresaRouter = Router();

empresaRouter.post("/empresa", empresaController.createEmpresa);
empresaRouter.get("/empresa", empresaController.getAllEmpresas);

export default empresaRouter;
