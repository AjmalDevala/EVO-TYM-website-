
const userModel = require('../models/userModel');
const addressModel = require('../models/addressModel');
const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');
const Razorpay = require("razorpay");
const { constants } = require('buffer');

var instance = new Razorpay({
  key_id: "rzp_test_M4gvOu40gMaQcJ",
  key_secret: "t0S9TRQPpKfk5RDOG3pQNRcI",
});


module.exports = {

    checkOutPage : async (req, res) => {
        let userData = req.session.user;
        let userId = userData._id;
        let user = await userModel.findOne({ _id: userId });
        let address1 = await addressModel.findOne({ userId: userId })
        let list = await cartModel.findOne({ userId: userId }).populate("products.productId")
        .sort({ date: -1 });
        let totalAmount=0
        if(list != undefined){
        totalAmount = list.cartTotal;
        }
        let cartProducts=[]
        if(list !=null){
         cartProducts = list.products
        }
        let address =[]
        if(address1 !=null){
         address = address1.address
        }
        let addressIndex = req.body.addressIndex;
        let selectedAddess=[]
        if (address1 != null){
         selectedAddess = req.body.addressIndex ?  address[req.body.addressIndex] : address1.address=[]
        }
        if (req.session.userlogin) {
          res.render("user/checkOutPage", { totalAmount,user,cartProducts,address,selectedAddess,addressIndex, login: true });
        } else {
          res.render("user/checkOutPage", {totalAmount, user,cartProducts,address, login: false });
        }
        
      },


      placeOrder: async (req, res) => {
        let userData = req.session.user;
        let userId = userData._id;
        let adrsIndex = req.body["index"];
        let payment_method = req.body["paymentMethod"];
        console.log(req.body);
        let addresses = await addressModel.findOne({ userId });
        let address = addresses.address[adrsIndex];
        let cart = await cartModel.findOne({ userId });
        let cartTotal=0
        if(cart != undefined) {
            cartTotal = cart.cartTotal;
        }
        let product=[]
        if(cart != null){
        products = cart.products;
        }
        const newOrder = new orderModel({
          userId,
          products,
          cartTotal,
          address,
          payment_method,
        });
        newOrder.save().then(async () => {
        });
        let orderId = newOrder._id;
        let total = newOrder.cartTotal;
        console.log(total);
        if (payment_method == "COD") {
          await cartModel.findByIdAndDelete({ _id: cart._id });
          res.json({ codSuccess: true });
        } else {
          return new Promise(async (resolve, reject) => {
            instance.orders.create(
              {
                amount: cartTotal * 100,
                currency: "INR",
                receipt: "" + orderId,
              },
              function (err, order) {
                resolve(order);
              }
            );
          }).then(async (response) => {
            res.json(response);
          });
        }
      },


    verifyPayment: async (req, res) => {
        let userData = req.session.user;
        let userId = userData._id;
        let cart = await cartModel.findOne({ userId });
        if (cart) {
          console.log(req.body);
          const crypto = require("crypto");
          let details = req.body;
          console.log(details);
          let hmac = crypto.createHmac("sha256", "t0S9TRQPpKfk5RDOG3pQNRcI");
          hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
          hmac = hmac.digest("hex");
          if (hmac == details['payment[razorpay_signature]']) {
            let orderId = details['order[receipt]'];
            await orderModel.findOneAndUpdate(
              { _id: orderId },
              { $set: { paymentStatus: "paid" } }
            );
            await cartModel.findByIdAndDelete({ _id: cart._id });
            res.json({ status: true });
          }
        } else {
          res.json({ status: false });
        }
      },

// new address add to chechout

  
      
  checkoutNewAddress: async (req, res) => {
    let userData = req.session.user;
    let userId = userData._id;
    const { fullName, address, phone, city, state, pincode } = req.body;
    let exist = await addressModel.findOne({ userId: userId });
    if (exist) {
      await addressModel
        .findOneAndUpdate(
          { userId },
          {
            $push: {
              address:{ fullName, address, phone, city, state, pincode },
            },
          }
        )
        .then(() => {
            console.log("add new address checkout page");
          res.redirect("/checkOutPage");
        });
    } else {
     address2 = new addressModel({
        userId,
        address: [{ fullName,address,phone,city,state,pincode }],
      });
      await address2
        .save()
        .then(() => {
          res.redirect("/checkOutPage");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  },
    



  
  



      confirmationPage : async(req,res)=>{
        let userData = req.session.user;
        let userId = userData._id;
        let user = await userModel.findOne({ _id: userId });

         res.render("user/confirmationPage",{user, login: true})
      }






}