const bcrypt = require('bcryptjs');
const logger = require('../utils/logging');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { log } = require('../../locale/messages');
const { TE, MP, HEX } = require('../../constants/constants');


const randomOrTempPasswordGenerate = function(max, min) {
    let buf = crypto.randomBytes(10);
    let randPassword = buf.toString(HEX);
    return TE + randPassword + MP;
};

const getEncryptedPassword = (password) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

const comparePassword = async(candidatePassword, hash) => {
    const result = bcrypt.compareSync(candidatePassword, hash);
    if (result) return true;
    return false;
}

const createUserPayload = async(userPayload) => {
    try {
        userPayload.username = userPayload.username.toLowerCase();
        userPayload.password = await getEncryptedPassword(userPayload.password);
        return userPayload;
    } catch (error) {
        logger.error(error, log.error.payloadMessages);
        return error;
    }
}

const bindArrayOfArray = async(array1, array2) => {
    for (let item of array2) {
        array1.push(item);
    }
}

module.exports = {
    getEncryptedPassword,
    randomOrTempPasswordGenerate,
    createUserPayload,
    comparePassword,
    bindArrayOfArray
}