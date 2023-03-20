const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = Schema({

    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    gender:{
        type: Number,
        required: true,
    },
    
    email:{
        type: String,
        required: true,
    },

    password:{
        type: String,
        required: true,
    },

    token: {
        type: String,
        required: false,
    },

    date:{
        type: Date,
        default: Date.now(),
    }
});




module.exports = User = mongoose.model("User", userSchema);