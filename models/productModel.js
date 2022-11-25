const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const productSchema = new mongoose.Schema({

   category: {
      type: ObjectId,
      required: true,
      ref: 'categoryData'
   },
   name: {
      type: String,
      required: true

   },
   price: {
      type: Number,
      required: true
   },
   brand: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   image: {
      type: String,
      required: true,
   },
   status: {
      type: String,
      default: "list"

   },
   date:{
      type : Date,
      default : Date.now,
   }
});

module.exports = productModel = mongoose.model('productData', productSchema);