import { Router } from "express";
import { onlinePurchase, purchaseItem } from "../controllers/paymentController";
import validateSchema from "../middlewares/schemaValidator";
import paymentSchema from "../schemas/paymentSchema";
import onlinePaymentSchema from "../schemas/onlinePaymentSchema";

const router = Router();

router.post('/payment/:cardId', validateSchema(paymentSchema), purchaseItem);
router.post('/online/payment', validateSchema(onlinePaymentSchema), onlinePurchase);

export default router;