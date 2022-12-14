import joi from "joi";

const cardTypeSchema = joi.object({
  type: joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
});

export default cardTypeSchema;