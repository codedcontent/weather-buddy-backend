const Joi = require("joi");

// Register validation
exports.registerValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().max(45).required(),
    last_name: Joi.string().max(45).required(),
    password: Joi.string().required().min(7),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
      })
      .required(),
    phone: Joi.string().required().min(11).max(14),
  });

  return schema.validate(data);
};

// Login validation
exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
      })
      .required(),
    password: Joi.string().required().min(7),
  });

  return schema.validate(data);
};

// Email validation
exports.emailValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
      })
      .required(),
  });

  return schema.validate(data);
};

// Password validation
exports.passwordValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().required().min(7),
  });

  return schema.validate(data);
};

// Profile Edit validation
exports.profileEditValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().max(45).required(),
    last_name: Joi.string().max(45).required(),
    phone: Joi.string().required().min(11).max(14),
  });

  return schema.validate(data);
};
