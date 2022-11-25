const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'userData'
       },     
       products:[{        
                productId: { type:mongoose.Schema.Types.ObjectId, ref: 'productData'},
                quantity: {type:Number , default:  1 },
                total : {type: Number},
                date:{type:Date,default: Date.now}
        }],
        cartTotal : {
            type: Number,
            default: 0                
        }
})

module.exports= cartModel= mongoose.model('cartData',cartSchema)
