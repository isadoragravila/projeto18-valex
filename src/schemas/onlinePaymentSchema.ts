import joi from "joi";

const onlinePaymentSchema = joi.object({
    cardNumber: joi.string().length(16).required(),
    cardholderName: joi.string().required(),
    expirationDate: joi.string().required(),
    CVV: joi.string().length(3).required(),
    businessId: joi.number().integer().required(),
    amount: joi.number().greater(0).required()
});

export default onlinePaymentSchema;