const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

//User Schema
const UserSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    phone: { type: String, required: false },
    profile: { type: String, required: false }
});

UserSchema.plugin(updateIfCurrentPlugin);

/*mongoose.set('debug', function (coll, method, query, doc) {
    console.log(query);
    console.log(JSON.stringify(query));
 });*/

const User = module.exports = mongoose.model('User', UserSchema);