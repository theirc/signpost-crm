const Joi = require('joi');

module.exports = {
    session: {
        body: {
          phone: Joi.string()
            .required(),
          category: Joi.number()
            .integer()
            .required(),
        },
      },
}