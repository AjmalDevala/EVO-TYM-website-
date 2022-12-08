const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
    ref :"UserData"
  },
  products: {
    type: [
      {
        productId: { type: ObjectId, ref: "productData" },
        quantity: { type: Number },
        total: { type: Number, required: true },
        orderStatus: { type: String,default: "OrderPlaced", },
        paymentStatus: {type: String,default: "pending",
        },
      },
    ],
  },
  address: {
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
  },
  cartTotal: {
    type: Number,   
    required: true,
  },
  payment_method: {
    type: String,
  },
  date: {
    type: Date,
  },
});
module.exports = orderModel = mongoose.model("OrderData", orderSchema);
