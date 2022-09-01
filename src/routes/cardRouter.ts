import { Router } from "express";
import { createCard } from "../controllers/cardController";
import validateSchema from "../middlewares/schemaValidator";
import cardTypeSchema from "../schemas/cardTypeSchema";

const router = Router();

router.post('/card/create/:employeeId', validateSchema(cardTypeSchema), createCard);

export default router;