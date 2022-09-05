import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService";

export async function rechargeCard(req: Request, res: Response) {
    const cardId = Number(req.params.cardId);
    const { amount } = req.body;
    const apikey = req.headers["x-api-key"];

    const result = await rechargeService.rechargeCard(cardId, amount, apikey);

    return res.status(201).send(result);
}