const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    name: String,
    username: String,
    email: String,
    role: {
        type: String,
        default: "User"
    },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);