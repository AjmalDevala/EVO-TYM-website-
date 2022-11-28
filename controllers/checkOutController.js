
const userModel = require('../models/userModel');
const addressModel = require('../models/addressModel');
const cartModel = require('../models/cartModel');

const Razorpay =require("razorpay");

module.exports = {

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

      order: async (req, res) => {
        const payment_method = req.body.paymentType
        console.log(req.body.paymentType);
        let userData = req.session.user;
        let userId = userData._id;
        const viewcart = await cartModel.findOne({ user: userId }).populate("products.productId").exec()
    
        if (payment_method == "cod") {
            console.log("reached on cod");
            res.json({ cod: true });
        } else {
            console.log("reached on online ");
            var instance = new Razorpay({
                key_id: process.env.KEY_ID,
                key_secret: process.env.KEY_SECRET,
            });
    
            instance.orders.create(
                {
                    amount: (viewcart.total) * 100,
                    currency: "INR",
                    receipt: "asd1234123",
                },
                function (err, order) {
                    if (err) {
                        console.log('Error');
                        console.log(err);
                    } else {
                        res.json({ order, cod: false });
                        console.log("New Order: ", order);
                    }
                }
            );
        }
    },




      verifyPayment: async (req, res) => {
        const details = req.body
        console.log(req.body, "dt");
        const crypto = require('crypto')
        let hmac = crypto.createHmac('sha256', process.env.KEY_SECRET)
        hmac.update(details['payment[razorpay_order_id]'] + "|" + details['payment[razorpay_payment_id]'], process.env.KEY_SECRET);
        hmac = hmac.digest('hex')
    
        const orderId = details['order[order][receipt]']
        console.log("Showing orderID");
        console.log(orderId);
        // console.log(hmac,details['payment[razorpay_signature]'],"check match")
        let response = { "cod": false }
        if (details['payment[razorpay_signature]'] == hmac) {
            console.log('order Successfull');
            response = { "cod": true }
        } else {
            response = { "cod": false }
            console.log('payment failed');
        }
        res.send(response);
    },

    orderSuccess: async (req, res) => {
      const userId = req.user.id;
      const Address = await addressModel.findOne({ user: userId })
      const viewcart = await cartModel.findOne({ user: userId }).populate("products.productId").exec()
      const products = viewcart.products
      const newOrderList = new orderModel({
          user: userId,
          products: products,
          address: Address.id,
          total: viewcart.cartTotal,
          payment_method: "Razorpay",
          payment_status: "Paid"
      });
      await newOrderList.save()
          .then(async () => {
              await cartModel.deleteOne({ user: userId })
              res.redirect("/thankyou")
          })
          .catch(() => {
              console.log("Send to Jquery");
          })
  },
  
  orderSuccessCOD:  async (req, res) => {
      const userId = req.user.id;
      const Address = await addressModel.findOne({ user: userId })
      const viewcart = await cartModel.findOne({ user: userId }).populate("products.productId").exec()
      const products = viewcart.products
      const newOrderList = new orderModel({
          user: userId,
          products: products,
          address: Address.id,
          total: viewcart.total,
          payment_method: "Cash On Delivery",
      });
      await newOrderList.save()
          .then(async () => {
              await cartModel.deleteOne({ user: userId })
              res.redirect("/thankyou")
          })
          .catch(() => {
              console.log("Send to Jquery");
          })
  },


      confirmationPage : (req,res)=>{

        
         res.render("user/confirmationPage")
      }







}