import { Router } from "express";
import { createCard, activateCard } from "../controllers/cardController";
import validateSchema from "../middlewares/schemaValidator";
import cardTypeSchema from "../schemas/cardTypeSchema";
import passwordSchema from "../schemas/passwordSchema";

const router = Router();

router.post('/card/create/:employeeId', validateSchema(cardTypeSchema), createCard);
router.post('/card/activate/:employeeId/:cardId', validateSchema(passwordSchema), activateCard);

export default router;