const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        default: 'user'
    },
    username : {
        type : String,
        required : "Username is required",
        unique: true
    },
    mobile : {
        type : String,
        minlength : 10,
        required : "Mobile number is required"
    }, 
    password: {
        type : String,
        required : true,
        minlength : 6,
        validate: [
            (input) => input.length >= 6,
            "Password should be longer."
          ]
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
}