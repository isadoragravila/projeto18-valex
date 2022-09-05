import { Router } from "express";
import cardRouter from './cardRouter';
import rechargeRouter from "./rechargeRouter";
import paymentRouter from "./paymentRouter";
import virtualCardRouter from "./virtualCardRouter";

const router = Router();

router.use(cardRouter);
router.use(rechargeRouter);
router.use(paymentRouter);
router.use(virtualCardRouter);

export default router;
