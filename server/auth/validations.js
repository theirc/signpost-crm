const Joi = require('joi');

module.exports = {
    login: {
        body: {
          username: Joi.string()
            .email()
            .required(),
          password: Joi.string()
            .required()
            .max(128),
        },
      },
}