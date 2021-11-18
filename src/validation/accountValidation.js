const Joi = require('@hapi/joi');
const { password, objectId } = require('./customValidation');
const { ALERTMODULE, REQUESTMODULE, ADDUSERMODULE } = require('../../constants/constants');

const addUserAccount = {
    body: Joi.object().keys({
        username: Joi.string().required().email(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        phone: Joi.string().allow(''),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required()
    }),
};

const editProfileAccount = {
    body: Joi.object().keys({
        firstname: Joi.string(),
        lastname: Joi.string(),
        phone: Joi.string(),
        password: Joi.string(),
        profile: Joi.object()
    }),
};

const login = {
    body: Joi.object().keys({
        username: Joi.string().trim().required().email(),
        password: Joi.string().trim().required(),
    }),
};

module.exports = {
    addUserAccount,
    editProfileAccount,
    login
}