const User = require('../models/user');

exports.getUser = async(query) => {
    return await User.findOne(query, { "password": 0, "resetPasswordTokenExpires": 0, "resetPasswordToken": 0 });
};

exports.getUserWithCredentials = async(query) => {
    return await User.findOne(query);
}

exports.getAllUser = async(query) => {
    return await User.find(query, { "password": 0, "resetPasswordTokenExpires": 0, "resetPasswordToken": 0 });
};

exports.updateUser = async(userPayload) => {
    const user = new User(userPayload);
    return await user.save();
};

exports.updateUserByQuery = async(query, updatedData) => {
    return await User.updateOne(query, updatedData);
}