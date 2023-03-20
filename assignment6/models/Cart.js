const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const cartSchema = Schema({

    user_id:{
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    }

    
});




module.exports = Cart = mongoose.model("Cart", cartSchema);