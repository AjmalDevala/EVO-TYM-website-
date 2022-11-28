const mongoose =require('mongoose')


const bannerSchema = new mongoose.Schema({

     image : {
        type :String,
        required : true
     },
     tittle :{
        type : String,
        required : true 
     },
     text :{
        type :String,
        required : true
     }

});

module.exports= bannerModel = mongoose.model("bannerData",bannerSchema)