const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    mobile: {
        type: String,
        required: [true, 'Please provide your mobile number'],
        maxlenght: 10,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
    },
    cpassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        minlength: 8,
    },
    tokens: [
        {
        token:{
            type: String,
        }
    }
    ],

    carts:Array
});

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (this.isModified('password')){
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
   }
    next();
});

//token generate

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

//store cart data
userSchema.methods.addtoCart = async function (cart) {
    try {
        this.carts = this.carts.concat(cart);
        await this.save();
        return this.carts;
    } catch (error) {
        console.log(error);
    }
}


const User = mongoose.model('User', userSchema);
module.exports = User;
