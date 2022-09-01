import { findByTypeAndEmployeeId, TransactionTypes } from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";

export async function createCard(apiKey: string | string[] | undefined, employeeId: number, type: TransactionTypes) {
    //verifica se apiKey é válida - ok
    const company = await validateApiKey(apiKey);
    //verifica se o empregado é da companhia - ok
    const employee = await checkEmployee(employeeId, company.id);
    //verifica se empregado já possui cartão daquele tipo - ok
    await checkTypeAndEmployee(type, employee.id);

    return "cartão";
}

async function validateApiKey(apiKey: string | string[] | undefined) {
    const company = await findByApiKey(apiKey);

    if (!company)  throw {code: "unauthorized_error", message: "Invalid API Key"};

    return company;
}

async function checkEmployee(employeeId: number, companyId: number) {
    const employee = await findById(employeeId);

    if (!employee) throw {code: "notfound_error", message: "User isn't an employee registered in the database"};

    if (employee.companyId !== companyId) throw {code: "unauthorized_error", message: "User isn't an employee of the company"};

    return employee;
}

async function checkTypeAndEmployee(type: TransactionTypes, employeeId: number) {
    const result = await findByTypeAndEmployeeId(type, employeeId);

    if(result) throw {code: "conflict_error", message: "Employee already has this card type"}

    return result;
}