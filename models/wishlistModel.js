const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref:'userData'
    },
    productIds:{
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
        ref:'productData',

    }, 
    date:{
        type : Date,
        default : Date.now,
     },

});


module.exports= wishlistModel =mongoose.model('wishlistData',wishlistSchema)