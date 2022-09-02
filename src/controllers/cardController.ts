import { Request, Response } from "express";
import * as cardService from '../services/cardService';

export async function createCard(req: Request, res: Response) {
    const employeeId = Number(req.params.employeeId);
    const { type } = req.body;
    const { apikey } = req.headers;

    const result = await cardService.createCard(apikey, employeeId, type);

    return res.status(201).send(result);
}

export async function activateCard(req: Request, res: Response) {
    const employeeId = Number(req.params.employeeId);
    const cardId = Number(req.params.cardId);
    const { password, CVV } = req.body;

    const result = await cardService.activateCard(employeeId, cardId, password, CVV);

    return res.status(200).send(result);
}

export async function blockUnblockCard(req: Request, res: Response) {
    const cardId = Number(req.params.cardId);
    const { action } = req.params;
    const { password } = req.body;

    const result = await cardService.blockUnblockCard(cardId, action, password);

    return res.status(200).send(result);
}