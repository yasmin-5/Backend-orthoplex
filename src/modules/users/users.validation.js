
const Joi = require("joi");
const knex = require("knex")


const isEmailUnique = async (email) => {
  const count = await knex("users").where({ email }).count("id as count");
  return count[0].count === 0;
};

const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required().custom(async (value, helpers) => {
    const isUnique = await isEmailUnique(value);
    if (!isUnique) {
      return helpers.message("Email already exists");
    }
    return value;
  }),
  password: Joi.string().min(8).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required().custom(async (value, helpers) => {
    const isUnique = await isEmailUnique(value);
    if (!isUnique) {
      return helpers.message("Email already exists");
    }
    return value;
  }),
});

module.exports = { userSchema, updateUserSchema };