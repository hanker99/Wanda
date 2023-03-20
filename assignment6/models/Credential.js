const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const credentialsSchema = Schema({

    name:{
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    }

    
});




module.exports = User = mongoose.model("Credential", credentialsSchema);