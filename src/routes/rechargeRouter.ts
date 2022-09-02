import { Router } from "express";
import { rechargeCard } from "../controllers/rechargeController";
import validateSchema from "../middlewares/schemaValidator";
import rechargeSchema from "../schemas/rechargeSchema";

const router = Router();

router.post('/recharge/:cardId', validateSchema(rechargeSchema), rechargeCard);

export default router;