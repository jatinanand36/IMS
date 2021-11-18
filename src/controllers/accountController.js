const User = require('../models/user');
const ApiError = require('../utils/apiError');
const accountUtil = require('../utils/accountUtil');
const accountService = require('../services/accountService');
const tokenService = require('../services/tokenService');
const logger = require('../utils/logging');
const config = require('config');
const tokenVerification = require('../authorization/token');
const { log, response } = require('../../locale/messages');
const { ROLE, ADDUSERMODULE, ALERTMODULE, REQUESTMODULE, ERROR, SUCCESS, REGASK_URL, AUTHORIZATION, COGNITOREGASK, EXPERT, EXTERNALEXPERT, ADMIN, MANAGER, CLIENT, HTTP_CODES } = require('../../constants/constants');
const passwordValidator = require('password-validator');
const schema = new passwordValidator();
schema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits(1)



exports.addUser = async(req, res, next) => {

    logger.info({ payload: req.body }, log.info.receivedPayloadAddUse);

    let body = req.body;
    try {
        const userInfo = await accountService.getUser({ username: body.username.toLowerCase() });
        if (userInfo) {
            logger.warn({ payload: body }, `${log.warn.userEemail} ${body.username} ${log.warn.addressAlreadyExist}`);
            return res.json({
                status: ERROR,
                sub_status: null,
                msg: response.emailAddressAlreadyExists,
            });
        }
        if (body.password === body.confirmPassword || schema.validate(body.password)) {
            body.password = body.password;
        }
        const userPayload = await accountUtil.createUserPayload(body);
        const newUser = new User(userPayload);
        const savedUser = await newUser.save();
        logger.info({ data: savedUser }, log.info.userCreatedSuccessfully);
        const token = await tokenService.generateToken(newUser);
        res.status(HTTP_CODES.SUCCESS).send({
            status: SUCCESS,
            msg: response.accountAdded,
            JWT: token
        });
    } catch (err) {
        logger.error({ err }, log.error.errorOccuredAddingUser);
        return next(new ApiError(response.unableAaddAser, HTTP_CODES.BADREQUEST));
    }
};

exports.editProfile = async(req, res, next) => {
    logger.info({ payload: req.body }, log.info.receivedPayloadEditAccount);
    let body = req.body;
    var objConvertToString = JSON.stringify(req.body)
    req.body = JSON.parse(objConvertToString.substring(objConvertToString.indexOf("{")))
    let location = '/uploads/' + req.files.profile.name;
    try {
        const username = req.user && req.user.username ? req.user.username : '';
        let query = { username: username };
        let updatedData = {};
        if (body.password || schema.validate(body.password)) {
            updatedData.password = body.password;
        }
        if (body.firstname) {
            updatedData.firstname = body.firstname;
        }
        if (body.lastname) {
            updatedData.lastname = body.lastname;
        }
        updatedData.profile = location;
        let updatedDataMain = {
            $set: updatedData
        }
        console.log(updatedDataMain);
        const updatedUser = await accountService.updateUserByQuery(query, updatedDataMain);
        return res.status(HTTP_CODES.SUCCESS).json({ status: SUCCESS, msg: response.accountUpdated, data: updatedUser });

    } catch (err) {

        logger.error({ err }, log.error.errorOccuredEditingUser);
        return next(new ApiError(response.unableEditUser, HTTP_CODES.BADREQUEST));
    }
}


exports.login = async(req, res, next) => {
    logger.debug({ username: req.body.username }, log.debug.receivedUsernameLogin);
    const { username, password } = req.body;
    try {
        const user = await accountService.getUserWithCredentials({ username: username.toLowerCase() });
        if (!user) {
            logger.info({ username }, log.info.userLoginUnsuccessfull);
            return next(new ApiError(response.passwordIncorrect, HTTP_CODES.FORBIDDEN));
        } else {
            const token = await tokenService.generateToken(user);
            logger.info({ username }, log.info.userLoginSuccessfull);
            res.json({
                status: SUCCESS,
                msg: response.userLoginSuccessfull,
                data: {
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        username: user.username
                    },
                },
            });
        }
    } catch (err) {
        logger.error({ body: { username, password }, err: err }, log.error.incorrectUsernamePassword);
        return next(new ApiError(response.UserNamepasswordIncorrect, HTTP_CODES.INTERNALERROR));
    }
};

exports.logout = async(req, res) => {
    req.logout();
    res.json({ status: SUCCESS, msg: response.userLoggedOutSuccessfully });
};