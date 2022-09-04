import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";

export async function purchaseItem(req: Request, res: Response) {
    const cardId = Number(req.params.cardId);
    const { password, businessId, amount } = req.body;

    const result = await paymentService.purchaseItem(cardId, password, businessId, amount);

    return res.status(201).send(result);
}

export async function onlinePurchase(req: Request, res: Response) {
    const { cardNumber, cardholderName, expirationDate, CVV, businessId, amount } = req.body;

    const result = await paymentService.onlinePurchase(cardNumber, cardholderName, expirationDate, CVV, businessId, amount);

    return res.status(201).send(result);
}