const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({

    category:{
        type : String,
        required : true,
    },
    status:{
        type : String,
        default :"active"

    }
  
})
    

module.exports = categoryModel = mongoose.model('categoryData',categorySchema);