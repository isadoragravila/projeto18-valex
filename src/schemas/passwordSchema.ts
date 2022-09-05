import joi from "joi";

const passwordSchema = joi.object({
  password: joi.string().length(4).pattern(/^[0-9]+$/).required()
});

export default passwordSchema;