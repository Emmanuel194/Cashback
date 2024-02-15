import { Router } from "express";
import clientController from "../controllers/client.controller";

const ClientRoutes = ():Router => {
    const router = Router();

    router.post("/", clientController.createClient);
    router.get("/", clientController.getAllClient);
    router.get("/search", clientController.findClient);
    router.patch("/:id", clientController.updateClient);
    router.delete("/:id", clientController.deleteClient);

    return router;
};

export default ClientRoutes;