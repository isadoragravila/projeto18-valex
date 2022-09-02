import joi from "joi";

const passwordSchema = joi.object({
  password: joi.string().length(4).required()
});

export default passwordSchema;