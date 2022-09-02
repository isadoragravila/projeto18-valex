import { Router } from "express";
import { purchaseItem } from "../controllers/paymentController";
import validateSchema from "../middlewares/schemaValidator";
import paymentSchema from "../schemas/paymentSchema";

const router = Router();

router.post('/payment/:cardId', validateSchema(paymentSchema), purchaseItem);

export default router;