import { decryptPasswords, getTotalAmount, validateCardId, validateExpirationDate } from "./cardService";
import * as paymentRepository from '../repositories/paymentRepository';
import * as businessRepository from '../repositories/businessRepository';

export async function purchaseItem (cardId: number, password: string, businessId: number, amount: number) {
    const card = await validateCardId(cardId);

    if (!card.password) throw { code: "unauthorized_error", message: "This card isn't active" };

    validateExpirationDate(card.expirationDate);

    if (card.isBlocked) throw { code: "unauthorized_error", message: "This card is blocked" };

    decryptPasswords(card.password, password);

    const business = await findBusiness(businessId);

    if (card.type !== business.type) throw { code: "conflict_error", message: "The establishment type isn't the same as the card type" }

    const { balance } = await getTotalAmount(cardId);

    const valueInCents = Number(amount.toFixed(2)) * 100;

    if (balance < valueInCents) throw { code: "unauthorized_error", message: "Insufficient funds" };

    await paymentRepository.insert({ cardId, businessId, amount: valueInCents })

    return `Purchase done. New balance: $${((balance - valueInCents)/100).toFixed(2).replace(".", ",")}`;
}

async function findBusiness(businessId: number) {
    const business = await businessRepository.findById(businessId);

    if (!business) throw { code: "notfound_error", message: "Establishment isn't registered" };

    return business;
}