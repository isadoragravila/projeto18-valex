import joi from "joi";

const paymentSchema = joi.object({
    password: joi.string().length(4).required(),
    businessId: joi.number().integer().required(),
    amount: joi.number().greater(0).required()
});

export default paymentSchema;