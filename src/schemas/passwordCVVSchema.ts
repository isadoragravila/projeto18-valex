import joi from "joi";

const passwordCVVSchema = joi.object({
  password: joi.string().length(4).required(),
  CVV: joi.string().length(3).required()
});

export default passwordCVVSchema;