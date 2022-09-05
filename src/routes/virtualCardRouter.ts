import { Router } from "express";
import { createVirtualCard } from "../controllers/virtualCardController";
import validateSchema from "../middlewares/schemaValidator";
import passwordSchema from "../schemas/passwordSchema";

const router = Router();

router.post('/virtual/card/create/:cardId', validateSchema(passwordSchema), createVirtualCard);

export default router;