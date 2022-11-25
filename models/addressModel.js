const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({ 
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'userData'
       },
       address:[{
         fullName : {
            type: String,
            required: true
        },
        phone : {
            type: Number,
            required: true
        },
        address : {
            type : String,
            required: true
        },
        city : { 
            type : String,
            required : true
        },
        pincode : {
            type :String,
            required: true
        },
        state : {
            type : String,
            required : true
        }
    }],
    
      
})

module.exports= addressModel = mongoose.model('addressData',addressSchema)