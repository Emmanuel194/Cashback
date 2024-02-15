import { Router } from "express";
import verifyFields from "../middlewares/verifyFields";
import EmployeeController from "../controllers/employee.controller";

const EmployeeRouters = (): Router => {
    const router = Router();

    router.post("/", verifyFields, EmployeeController.createEmployee);
    router.get("/", EmployeeController.getAllEmployee);
    router.patch("/:id", verifyFields, EmployeeController.updateEmployee);
    router.delete("/:id", EmployeeController.deleteEmployee);
    return router;
};

export default EmployeeRouters;