const jwt = require('jsonwebtoken');
const config = require('config');
const ApiError = require('../utils/apiError');
const { log } = require('../../locale/messages');
const { TOKEN_EXPIRY, JWT_SECRET, HTTP_CODES } = require('../../constants/constants');

exports.generateToken = (async(user) => {
    const encodedInfo = {
        _id: user._id,
        username: user.username
    }
    try {
        const token = await jwt.sign(encodedInfo, config.get(JWT_SECRET), {
            expiresIn: config.get(TOKEN_EXPIRY),
        });
        return token;
    } catch (err) {
        return (new ApiError(log.error.generateToken, HTTP_CODES.BADREQUEST));
    }
})