import * as cardRepository from "../repositories/cardRepository";
import * as companyRepository from "../repositories/companyRepository";
import * as employeeRepository from "../repositories/employeeRepository";
import * as paymentRepository from "../repositories/paymentRepository";
import * as rechargeRepository from "../repositories/rechargeRepository";
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Cryptr from 'cryptr';
import dotenv from 'dotenv';
dotenv.config();

export async function createCard(apiKey: string | string[] | undefined, employeeId: number, type: cardRepository.TransactionTypes) {
    const company = await validateApiKey(apiKey);

    const employee = await checkEmployeeAndCompany(employeeId, company.id);

    await checkTypeAndEmployee(type, employee.id);

    const cardNumber = faker.finance.creditCardNumber('################');
    const cardholderName = generateCardName(employee.fullName);
    const expirationDate = dayjs().add(5, 'year').format('MM/YY');
    const securityCode = generateSecurityCode();

    const cardData = {
        employeeId,
        number: cardNumber,
        cardholderName,
        securityCode: securityCode.encryptedCVV,
        expirationDate,
        password: undefined,
        isVirtual: false,
        originalCardId: undefined,
        isBlocked: false,
        type,
    }

    await cardRepository.insert(cardData);

    return {number: cardNumber, cardholderName, expirationDate, securityCode: securityCode.CVV};
}

async function validateApiKey(apiKey: string | string[] | undefined) {
    const company = await companyRepository.findByApiKey(apiKey);

    if (!company) throw { code: "unauthorized_error", message: "Invalid API Key" };

    return company;
}

async function checkEmployeeAndCompany(employeeId: number, companyId: number) {
    const employee = await employeeRepository.findById(employeeId);

    if (!employee) throw { code: "notfound_error", message: "User isn't an employee registered in the database" };

    if (employee.companyId !== companyId) throw { code: "unauthorized_error", message: "User isn't an employee of the company" };

    return employee;
}

async function checkTypeAndEmployee(type: cardRepository.TransactionTypes, employeeId: number) {
    const result = await cardRepository.findByTypeAndEmployeeId(type, employeeId);

    if (result) throw { code: "conflict_error", message: "Employee already has this card type" }

    return result;
}

function generateCardName(name: string) {
    let cardNameArray = name.toUpperCase().split(" ").filter(name => name.length >= 3);

    for (let i = 1; i < cardNameArray.length - 1; i++) {
        cardNameArray[i] = cardNameArray[i][0];
    }

    return cardNameArray.join(" ");
}

function generateSecurityCode() {
    const cryptr = new Cryptr(process.env.SECRET_KEY || "secret_key");

    const CVV = faker.finance.creditCardCVV();

    const encryptedCVV = cryptr.encrypt(CVV);

    return { CVV, encryptedCVV };
}

export async function activateCard(employeeId: number, cardId: number, password: string, CVV: string) {
    const card = await validateCardId(cardId);

    if (employeeId !== card.employeeId) throw { code: "unauthorized_error", message: "This card doesn't belong to the employee" };

    validateExpirationDate(card.expirationDate);

    if (card.password) throw { code: "conflict_error", message: "This card is already active" };

    decryptPasswords(card.securityCode, CVV);

    if (password.length !== 4) throw { code: "unauthorized_error", message: "Password must have 4 digits" };

    await cardRepository.update(cardId, { password: encryptPassword(password) });

    return "Card activated";
}

export async function validateCardId(cardId: number) {
    const card = await cardRepository.findById(cardId);

    if (!card) throw { code: "notfound_error", message: "Card isn't registered in the database" };

    return card;
}

export function validateExpirationDate(expirationDate: string) {
    dayjs.extend(customParseFormat);

    if (dayjs().isAfter(dayjs(expirationDate, "MM/YY"))) {
        throw { code: "conflict_error", message: "This card is expired" };
    }
}

function decryptPasswords(encryptedCode: any, code: string) {
    if (typeof encryptedCode !== 'string') {
        throw { code: "unauthorized_error", message: "Wrong security code or password" };
    }

    const cryptr = new Cryptr(process.env.SECRET_KEY || "secret_key");
    const decryptedCode = cryptr.decrypt(encryptedCode);

    if (decryptedCode !== code) {
        throw { code: "unauthorized_error", message: "Wrong security code or password" };
    }
}

function encryptPassword(password: string) {
    const cryptr = new Cryptr(process.env.SECRET_KEY || "secret_key");

    const encryptedPassword = cryptr.encrypt(password);

    return encryptedPassword;
}

export async function blockUnblockCard(cardId: number, action: string, password: string) {
    const card = await validateCardId(cardId);

    validateExpirationDate(card.expirationDate);

    decryptPasswords(card.password, password);

    if (action === "block") {
        if (card.isBlocked) throw { code: "conflict_error", message: "This card is already blocked" };

        await cardRepository.update(cardId, {isBlocked: true});
    
        return 'Card blocked';
    }

    if (action === "unblock") {
        if (!card.isBlocked) throw { code: "conflict_error", message: "This card is already blocked" };

        await cardRepository.update(cardId, {isBlocked: false});
    
        return 'Card unblocked';
    }
}

export async function getBalanceByCardId(cardId: number) {
    await validateCardId(cardId);

    const transactions = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);
    
    transactions.map(item => item.timestamp = dayjs(item.timestamp).format('DD/MM/YYYY'));
    recharges.map(item => item.timestamp = dayjs(item.timestamp).format('DD/MM/YYYY'));  

    const transactionsAmount = transactions.reduce((prev, curr) => (prev + curr.amount), 0);
    const rechargesAmount = recharges.reduce((prev, curr) => (prev + curr.amount), 0);

    const balance = rechargesAmount - transactionsAmount;

    return {balance, transactions, recharges};
}