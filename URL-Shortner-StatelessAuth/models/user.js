const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        requird: true
    },
    email: {
        type: String,
        requird: true,
        unique:true,
    },
    password: {
        type: String,
        requird: true
    }
},{timestamps: true});

const User = mongoose.model("user", userSchema);

module.exports = User;