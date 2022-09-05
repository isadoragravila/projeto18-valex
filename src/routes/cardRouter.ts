import { Router } from "express";
import { createCard, activateCard, blockUnblockCard, getBalanceByCardId } from "../controllers/cardController";
import validateSchema from "../middlewares/schemaValidator";
import cardTypeSchema from "../schemas/cardTypeSchema";
import passwordSchema from "../schemas/passwordSchema";
import passwordCVVSchema from "../schemas/passwordCVVSchema";

const router = Router();

router.post('/card/create/:employeeId', validateSchema(cardTypeSchema), createCard);
router.post('/card/activate/:employeeId/:cardId', validateSchema(passwordCVVSchema), activateCard);
router.put('/card/:action/:cardId', validateSchema(passwordSchema), blockUnblockCard);
router.get('/card/balance/:cardId', getBalanceByCardId);

export default router;