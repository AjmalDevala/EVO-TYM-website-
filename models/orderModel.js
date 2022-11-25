const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema ({
    userId : {
        type:ObjectId,
        required: true,    },
    products : {
        type:[{
            productId: { type:ObjectId, ref: 'ProductData'},
            quantity: {type:Number},
            total : {type: Number , required: true},
            
        }],
    },
    address : {
        type: ObjectId,
        required: true,
        ref : 'userAddress'
    },
    cartTotal : {
        type: Number,
        required:true
    },
    // paymentMethod : {
    //     type: String
    // },
    orderStatus : {
        type : String,
        default : 'Order placed'
    },
    date : {
        type: Date ,
        default : Date.now()
    }

})
module.exports= orderModel = mongoose.model('OrderData',orderSchema)