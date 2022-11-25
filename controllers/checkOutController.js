
const userModel = require('../models/userModel');
const addressModel = require('../models/addressModel');
const cartModel = require('../models/cartModel');

module.exports = {



    // checkOutPage: (req,res)=>{
    //     res.render("user/checkOutPage")
    // },
    checkOutPage : async (req, res) => {
        let userData = req.session.user;
        let userId = userData._id;
        let user = await userModel.findOne({ _id: userId });
        let address1 = await addressModel.findOne({ userId: userId })
        let list = await cartModel.findOne({ userId: userId }).populate("products.productId")
        .sort({ date: -1 });
        let totalAmount = list.cartTotal;
        let cartProducts = list.products
        let address = address1.address
        let selectedAddess = req.body.index ?  address[req.body.index] : address1.address[0]
        if (req.session.userlogin) {
          res.render("user/checkOutPage", { totalAmount,user,cartProducts,address,selectedAddess, login: true });
        } else {
          res.render("user/checkOutPage", {totalAmount, user,cartProducts,address, login: false });
        }
      },




      confirmationPage : (req,res)=>{
        
         res.render("user/confirmationPage")
      }







}