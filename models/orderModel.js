const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
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
    type: ObjectId,
    required: true,
    ref: "addressData",
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
    default: Date.now(),
  },
});
module.exports = orderModel = mongoose.model("OrderData", orderSchema);
