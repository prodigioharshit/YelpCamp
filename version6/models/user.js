var mongoose = require('mongoose');
var passportLocal = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    user:String,
    password:String
})
userSchema.plugin(passportLocal);

var User = mongoose.model("User",userSchema);
module.exports = User;