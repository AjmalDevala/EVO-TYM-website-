
const userModel = require('../models/userModel');
const addressModel = require('../models/addressModel');
const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');
const Razorpay = require("razorpay");
const { constants } = require('buffer');
const couponModel = require('../models/couponModel');


//===============================================================================================================
//  ------------------- razorpay- test mood key and secret key--------------- 
var instance = new Razorpay({
  key_id: "rzp_test_M4gvOu40gMaQcJ",
  key_secret: "t0S9TRQPpKfk5RDOG3pQNRcI",
});


module.exports = {
//===============================================================================================================
// checkoutpage render  page
  checkOutPage: async (req, res) => {
    try {
      let userData = req.session.user;
      let userId = userData._id;
      let coupon = await couponModel.find({});
      let user = await userModel.findOne({ _id: userId });
      let address1 = await addressModel.findOne({ userId: userId })
      let list = await cartModel.findOne({ userId: userId }).populate("products.productId")
        .sort({ date: -1 });
      let discount = 0
      if(coupon != undefined){
       discount = list.offer.discount
      }
      let totalAmount = 0
      if (list != undefined) {
        totalAmount = list.cartTotal; 
      }
      let cartProducts = []
      if (list != null) {
        cartProducts = list.products
      }
      let address = []
      if (address1 != null) {
        address = address1.address
      }
      let addressIndex = req.body.addressIndex;
      let selectedAddess = []
      if (address1 != null) {
        selectedAddess = req.body.addressIndex ? address[req.body.addressIndex] : address1.address = []
      }
      if (req.session.userlogin) {
        res.render("user/checkOutPage", { totalAmount, user, cartProducts, address,discount, selectedAddess, addressIndex,coupon, login: true });
      } else {
        res.render("user/checkOutPage", { totalAmount, user, cartProducts, address, login: false });
      }
    } catch {
      res.render("error")
    }

  },

//===============================================================================================================
// place order  user data saving the order page
  placeOrder: async (req, res) => {
    try {
      let userData = req.session.user;
      let userId = userData._id;
      let adrsIndex = req.body["index"];
      let payment_method = req.body["paymentMethod"];
      let addresses = await addressModel.findOne({ userId });
      let address = addresses.address[adrsIndex];
      let cart = await cartModel.findOne({ userId });
      let cartTotal = 0
      if (cart != undefined) {
        cartTotal = cart.cartTotal;
      }
      let product = []
      if (cart != null) {
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
    } catch {
      res.render("error")
    }
  },


  //===============================================================================================================
 // varifypayment for razoer pay 

  verifyPayment: async (req, res) => {
    try {
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
    } catch {
      res.render("error")
    }
  },
//===============================================================================================================
// new address add to chechout

  checkoutNewAddress: async (req, res) => {
    try {
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
                address: { fullName, address, phone, city, state, pincode },
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
          address: [{ fullName, address, phone, city, state, pincode }],
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
    } catch {
      res.render("error")
    }
  },
//===============================================================================================================
// success render page cod and razor pay

  confirmationPage: async (req, res) => {
    try {
      let userData = req.session.user;
      let userId = userData._id;
      let user = await userModel.findOne({ _id: userId });

      res.render("user/confirmationPage", { user, login: true })
    } catch {
      res.render("error")
    }
  },



//                                COUPON
//===============================================================================================================
//


deleteCoupon: async (req, res) => {
  const id = req.params.id;
  await couponModel.findByIdAndDelete({ _id: id }).then(() => {
    res.redirect("/admin/coupon");
  });
},

updateCoupon: async (req, res) => {

  const coupons = req.body;
 
  await couponModel(coupons).save().then(() => {
    res.redirect("/admin/coupon");
  });
},

coupon:async (req, res) => {
  let coupon = await couponModel.find({});
  res.render("admin/coupon",{coupon,index:1});
}, 


checkCoupen: async (req, res) => {
    try {   
      let userData = req.session.user;
      let userId = userData._id;
      const couponCode = req.body.code;
      const cartTotal = req.body.cartTotal;
      const confirmCode = await couponModel.findOne({ code: couponCode });
      console.log(confirmCode);
      if (confirmCode) {
        const existOffer = await cartModel.findOne({userId:userId})
        if (!existOffer.offer.couponId){
        discountCoupen = Math.round(cartTotal * confirmCode.discount/ 100) 
        console.log(discountCoupen);
        const cart = await cartModel.findOneAndUpdate(
          { userId: userId },
          {
            $set: {
              offer:{couponId: confirmCode._id, 
              discount : discountCoupen},
          
            },
            $inc: { cartTotal: -discountCoupen },
          },{multi : true}
        );
        res.json({apply:true});
        }else{
          res.json({exist : true})
        }
      }else{
        res.json({apply : false})
      }
    } catch {
      console.log("catch working");
    }
  },






}