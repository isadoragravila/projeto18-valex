import { Request, Response } from "express";
import * as virtualCardService from "../services/virtualCardService";

export async function createVirtualCard(req: Request, res: Response) {
    const cardId = Number(req.params.cardId);
    const { password } = req.body;

    const result = await virtualCardService.createVirtualCard(cardId, password);

    return res.status(201).send(result);
}