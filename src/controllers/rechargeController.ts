import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService";

export async function rechargeCard(req: Request, res: Response) {
    const cardId = Number(req.params.cardId);
    const { amount } = req.body;

    const result = await rechargeService.rechargeCard(cardId, amount);

    return res.status(201).send(result);
}