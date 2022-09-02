import * as cardRepository from "../repositories/cardRepository";
import * as companyRepository from "../repositories/companyRepository";
import * as employeeRepository from "../repositories/employeeRepository";
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
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
        securityCode,
        expirationDate,
        password: undefined,
        isVirtual: false,
        originalCardId: undefined,
        isBlocked: false,
        type,
    }

    await cardRepository.insert(cardData);

    return cardData;
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

    return encryptedCVV;
}