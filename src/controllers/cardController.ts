import { Request, Response } from "express";
import * as cardService from '../services/cardService';

export async function createCard(req: Request, res: Response) {
    const employeeId = Number(req.params.employeeId);
    const { type } = req.body;
    const { apikey } = req.headers;

    const result = await cardService.createCard(apikey, employeeId, type);

    return res.status(201).send(result);
}