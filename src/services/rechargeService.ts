import { validateCardId, validateExpirationDate } from "./cardService";
import * as rechargeRepository from '../repositories/rechargeRepository';

export async function rechargeCard (cardId: number, amount: number) {
    const card = await validateCardId(cardId);

    if (!card.password) throw { code: "unauthorized_error", message: "This card isn't active" };

    validateExpirationDate(card.expirationDate);

    const valueInCents = Number(amount.toFixed(2)) * 100;

    await rechargeRepository.insert({ cardId, amount: valueInCents });

    return `Card recharged. Amount: $${amount.toFixed(2).replace(".", ",")}`;
}