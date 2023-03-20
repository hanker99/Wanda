const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const mealkitSchema = Schema({

    title:{
        type: String,
        required: true,
    },

    includes:{
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    price: {
        type: String,
        required: false,
    },
    cookingTime: {
        type: String,
        required: false,
    },
    servings: {
        type: String,
        required: false,
    },
    caloriesPerServing: {
        type: String,
        required: false,
    },

    imageUrl: {
        type: String,
        required: false,
    },
    topMeal: {
        type: Boolean,
        required: false,
        default: false
    },

    date:{
        type: Date,
        default: Date.now(),
    }

});


module.exports = Mealkit = mongoose.model("Mealkit", mealkitSchema);