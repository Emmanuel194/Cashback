import { Router } from "express";

import balanceController from "../controllers/balance.controller";

const BalanceRouter = (): Router => {
    const router = Router();

    router.post("/", balanceController.createBalace);
    router.get("/", balanceController.getAllBalance);
    router.get("/search", balanceController.searchBalance);

    return router;
};
export default BalanceRouter;