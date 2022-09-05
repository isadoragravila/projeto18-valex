import { faker } from "@faker-js/faker";
import * as cardRepository from "../repositories/cardRepository";
import { decryptPasswords, generateSecurityCode, validateCardId } from "./cardService";
import dayjs from 'dayjs';

export async function createVirtualCard(cardId: number, password: string) {
    const card = await validateCardId(cardId);

    decryptPasswords(card.password, password);

    const cardNumber = faker.finance.creditCardNumber('mastercard');
    const expirationDate = dayjs().add(5, 'year').format('MM/YY');
    const securityCode = generateSecurityCode();

    const cardData = {
        employeeId: card.employeeId,
        number: cardNumber,
        cardholderName: card.cardholderName,
        securityCode: securityCode.encryptedCVV,
        expirationDate,
        password: card.password,
        isVirtual: true,
        originalCardId: card.id,
        isBlocked: false,
        type: card.type,
    }

    await cardRepository.insert(cardData);
    
    return {number: cardNumber, cardholderName: card.cardholderName, expirationDate, securityCode: securityCode.CVV};
}

export async function deleteVirtualCard(cardId: number, password: string) {
    const card = await validateCardId(cardId);

    if (!card.isVirtual) throw { code: "unauthorized_error", message: "This card isn't virtual. It's not possible to delete this card" }

    decryptPasswords(card.password, password);

    await cardRepository.remove(cardId);

    return "Virtual card deleted";
}