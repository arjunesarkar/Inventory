const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'] 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'] 
    },
    question: { 
        type: String 
    },
    // Add other fields as needed
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); // Adjust model name to 'User'
