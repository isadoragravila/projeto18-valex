import { Router } from "express";
import { createVirtualCard, deleteVirtualCard } from "../controllers/virtualCardController";
import validateSchema from "../middlewares/schemaValidator";
import passwordSchema from "../schemas/passwordSchema";

const router = Router();

router.post('/virtual/card/create/:cardId', validateSchema(passwordSchema), createVirtualCard);
router.delete('/virtual/card/delete/:cardId', validateSchema(passwordSchema), deleteVirtualCard);

export default router;