import Joi from 'joi';

export const signupSchema = Joi.object({
  username: Joi.string().min(4).required().messages({
    'string.base': 'Username should be a type of \'text\'',
    'string.empty': 'Username cannot be an empty field',
    'string.min': 'Username should have a minimum length of {#limit}',
    'any.required': 'Username is a required field'
  }),
  email: Joi.string().email().optional().allow(null, '').messages({
    'string.email': 'Email must be a valid email address'
  }),
  phone_number: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Phone number must be a valid phone number'
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password should be a type of \'text\'',
    'string.empty': 'Password cannot be an empty field',
    'any.required': 'Password is a required field'
  })
});
