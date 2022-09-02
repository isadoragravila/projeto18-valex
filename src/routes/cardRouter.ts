import { Router } from "express";
import { createCard, activateCard, blockUnblockCard } from "../controllers/cardController";
import validateSchema from "../middlewares/schemaValidator";
import cardTypeSchema from "../schemas/cardTypeSchema";
import passwordSchema from "../schemas/passwordSchema";
import passwordCVVSchema from "../schemas/passwordCVVSchema";

const router = Router();

router.post('/card/create/:employeeId', validateSchema(cardTypeSchema), createCard);
router.post('/card/activate/:employeeId/:cardId', validateSchema(passwordCVVSchema), activateCard);
router.post('/card/:action/:cardId', validateSchema(passwordSchema), blockUnblockCard);

export default router;