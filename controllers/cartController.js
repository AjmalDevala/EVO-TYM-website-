const { default: mongoose } = require('mongoose');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

module.exports = {

   //===============================================================================================================
  // add to cart using ajax
   addToCart: async (req, res) => {
      try{
      let productId = req.params.id;
      let userData = req.session.user;
      let userId = userData._id;
      let product = await productModel.findOne({ _id: productId })
      let total = product.price
      let cartExist = await cartModel.findOne({ userId: userId });

      if (cartExist) {
         const productExist = await cartModel.findOne({ userId, "products.productId": productId })

         if (productExist) {
            await cartModel.findOneAndUpdate({ userId, "products.productId": productId }, { $inc: { "products.$.quantity": 1, "products.$.total": total, cartTotal: total } })
               .then(() => {
                  console.log("one more product added to cart successfully");
                  res.json({status:true})
               });
         }
         else {
            await cartModel
               .findOneAndUpdate(
                  { userId: userId },
                  { $push: { products: { productId, total } }, $inc: { cartTotal: total } }
               )
               .then(() => {
                  console.log("  product added to cart successfully");
                  res.json({status:true})
               });
         }
      } else {
         const cartProduct = new cartModel({
            userId,
            products: [{ productId, total }],
            cartTotal: total
         });
         await cartProduct
            .save()
            .then(() => {
               console.log(" New product added to cart successfully");
               res.json({status:true})
            })
            .catch((err) => {
               console.log(err.message);
               res.json({status:true})
            });
      }
   }catch{
      res.render("error")
   }
   },

//===============================================================================================================
// cart render page 

   cart: async (req, res) => {
      try{
      let userData = req.session.user;
      let userId = userData._id;
      let cartlist = await cartModel.findOne({ userId }).populate("products.productId").sort({ date: -1 });
      let cart
      if (cartlist != null) {
         cart = cartlist.products
      } else {
         cart = [];
      }
      if (req.session.userlogin) {
         res.render("user/cart", {
            cart,
            login: true,
            cartlist,
            user: req.session.user
         });
      } else {
         res.render("user/cart", {
            login: false
         });
      }
   }catch{
      res.render("error")
   }

   },
//===============================================================================================================
// delete cart 

   removeCart: async (req, res) => {
      try{
      let userData = req.session.user;
      let userId = userData._id;
      let id = req.params.id;
      let price = req.params.price;
      let qty = req.params.quantity
      const amt = price * qty
      await cartModel.findOneAndUpdate({ userId: mongoose.Types.ObjectId(userId) }, {
         $pull: { products: { productId: id } }
         , $inc: { cartTotal: -amt }
      })
         .then(() => {
            res.redirect("/cartPage");
         });

      }catch{
         res.render('error')
      }

   },
//===============================================================================================================
// increment quantity  cart add new product
   incQuantity: async (req, res) => {
      try{
      let userData = req.session.user;
      const userId = userData._id;
      const productId = req.params.id
      const price = req.params.price
      await cartModel.findOneAndUpdate({ userId: mongoose.Types.ObjectId(userId), "products._id": mongoose.Types.ObjectId(productId) }, { $inc: { "products.$.quantity": 1, "products.$.total": price, cartTotal: price } })

      res.redirect('/cartpage')
      }catch{
         res.render("error")
      }
   },
   //===============================================================================================================
   // decrement quantity  or delete  product 
   decQuantity: async (req, res) => {
      try{
      let userData = req.session.user;
      const userId = userData._id;
      const productId = req.params.id
      const price = req.params.price
      await cartModel.findOneAndUpdate({ userId: mongoose.Types.ObjectId(userId), "products._id": mongoose.Types.ObjectId(productId) }, { $inc: { "products.$.quantity": -1, "products.$.total": -price, cartTotal: -price } })
      res.redirect('/cartpage')
      }catch{
         res.render("error")
      }
   }

//===============================================================================================================
//            cart end







}