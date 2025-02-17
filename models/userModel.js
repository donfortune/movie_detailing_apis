const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bycrypt = require('bcryptjs');

const ROLES = {
    USER: 'user',
    CINEMA_MANAGER: 'cinema_manager',
    PRODUCER: 'producer',
    ADMIN: 'admin'
};

const userSchema = new schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: ROLES.USER
    }
})


// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bycrypt.genSalt(10);
        this.password = await bycrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
        
    }
}); 

User = mongoose.model('User', userSchema);
module.exports = User;