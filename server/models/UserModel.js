const mongoose = require('mongoose')
const Schema  = mongoose.Schema;
const UserSchema = new Schema({
    email: {type :String,unique: true},
    password : String,
    firstName : String,
    lastName : String
})
const UserModel = mongoose.model("User", UserSchema);
module.exports = {UserModel};