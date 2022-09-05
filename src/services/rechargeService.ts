import { validateCardId, validateExpirationDate, validateApiKey, checkEmployeeAndCompany } from "./cardService";
import * as rechargeRepository from '../repositories/rechargeRepository';

export async function rechargeCard (cardId: number, amount: number, apiKey: string | string[] | undefined ) {
    const company = await validateApiKey(apiKey);

    const card = await validateCardId(cardId);

    await checkEmployeeAndCompany(card.employeeId, company.id);

    if (card.isVirtual) throw { code:"unauthorized_error", message: "This card is virtual. It's not possible to recharge it" };

    if (!card.password) throw { code: "unauthorized_error", message: "This card isn't active" };

    validateExpirationDate(card.expirationDate);

    const valueInCents = Number(amount.toFixed(2)) * 100;

    await rechargeRepository.insert({ cardId, amount: valueInCents });

    return `Card recharged. Amount: $${amount.toFixed(2).replace(".", ",")}`;
}