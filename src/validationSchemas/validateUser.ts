import Joi from 'joi';

export const userSchemas = {
  createUserSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(3).required(),
    surname: Joi.string().min(3).required(),
    role: Joi.string().min(3).optional(),
  }),

  loginUserSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  updateUserSchema: Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    name: Joi.string().min(3).optional(),
    surname: Joi.string().min(3).optional(),
    role: Joi.string().min(3).optional(),
  }),

  updateTokensSchema: Joi.object({}).unknown(false),
};
