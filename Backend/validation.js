const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(255).required().trim(),
    email: Joi.string().min(6).max(255).required().email().trim(),
    password: Joi.string().min(6).max(1024).required().trim(),
    confirmedPassword: Joi.string().min(6).max(1024).required().trim(),
  });
  return schema.validate(data);
};
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(6).max(255).required().email(),
    password: Joi.string().trim().min(6).max(1024).required(),
  });

  return schema.validate(data);
};

const createPostValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(10).max(255).required(),
    content: Joi.string().trim().min(20).max(1024).required(),
    // imageURL: Joi.string().min(6).max(1024),
  });

  return schema.validate(data);
};
const createCommentValidation = (data) => {
  const schema = Joi.object({
    comment: Joi.string().min(1).trim().max(255).required(),
  });

  return schema.validate(data);
};
const contactUsValidation = (data) => {
  const schema = Joi.object({
    fullname: Joi.string().min(4).trim().max(255).required(),
    email: Joi.string().trim().min(6).max(255).required().email(),
    message: Joi.string().min(10).trim().max(255).required(),
  });
  return schema.validate(data);
};
module.exports = {
  registerValidation,
  loginValidation,
  createPostValidation,
  createCommentValidation,
  contactUsValidation,
};
