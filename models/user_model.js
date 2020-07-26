const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = Schema({
    studentID: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: true
    },
    fname: {
        type: String,
        requied: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20,
        trim: true
    },
    image: {
        type: String
    },
    role: {
        type: String,
        default: 'Student'
    }
}, {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: 'cce-users'
})




userSchema.methods.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    return hashPass;
}
userSchema.methods.checkPassword = async(password, hash) => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}

const User = mongoose.model('users', userSchema);
module.exports = User;