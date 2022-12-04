const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const addressModel = require("../models/addressModel");
const moment = require("moment");


module.exports = {

    // admin order management
    orderManagement :async (req , res) => {
        let user = await userModel.find()
        const orders =  await orderModel.find().sort({date:-1}).populate('products.productId')
        res.render('admin/orderManagement' ,{orders,user,moment})      
      },


    editOrderStatuus: async (req, res) => {
      
        const productId = req.body.proId;
        const orderId = req.body.orderId;
        const status = req.body.status;
        console.log(productId + "////" + orderId + "////" + status);  
        await orderModel.updateOne(
          { _id: orderId, "products._id": productId },
          { $set: { "products.$.orderStatus": status } }
        ).then(() =>{
        res.json({statusChanged: true})
        })
      },


      editOrderStatus: async (req, res) => {
        const {orderId,proId,status } = req.body;
        console.log(req.body);
        console.log(status);
        if (status === "OrderPlaced") {
          await orderModel.updateOne(
            { _id: orderId, "products._id": proId },
            { $set: { "products.$.orderStatus": "Packed" } }
          );
        } else if (status === "Packed") {
          await orderModel.updateOne(
            { _id: orderId, "products._id": proId },
            { $set: { "products.$.orderStatus": "Shipped" } }
          );
        } else if (status === "Shipped") {
          await orderModel.updateOne(
            { _id: orderId, "products._id": proId },
            {
              $set: {
                "products.$.orderStatus": "Delivered",
                "products.$.paymentStatus": "Paid",
              },
            },
            { multi: true }
          );
        }
        //  else {
        //   await orderModel.updateOne(
        //     { _id: orderId, "products._id": proId },
        //     {
        //       $set: {
        //         "products.$.orderStatus": "Cancelled",
        //         "products.$.paymentStatus": "Unpaid",
        //       },
        //     },
        //     { multi: true }
        //   );
        // }
        res.json({ success: "success" });
        // res.json({status:true})

      },
    




      invoice : async(req , res) => {
        const productId = req.params.orderId
        const orderId = req.params.productId
        const orders =  await orderModel.findOne({_id : orderId }).populate('products.productId').populate('address.index')            
        res.render('admin/invoice',{orders, moment })
      },


    // user side order management

      userOrderPage : async (req , res ) => {
        let userData = req.session.user;
        let userId = userData._id;
        let user = await userModel.findOne({ _id: userId });
        let order = await orderModel.find({ userId }).populate('products.productId').sort ({date : -1})
        
    
        if (req.session.userlogin) {
          res.render("user/userOrderPage", { order, login: true,user,moment});
        } else {
          res.render("user/userOrderPage", { order, login: false });
        }
    
      },

      orderCancel : async (req,res) => {
        const productid = req.params.prodId;
        const orderId = req.params.orderId;      
        await orderModel.updateOne({_id:orderId,"products._id":productid},{$set:{"products.$.orderStatus":"Cancelled"}})
        .then(() => {
        res.redirect("/userOrderPage");
        }).catch((err)=>{
            console.log(err+"errrrrr");
        })

      }, 











      
      cancelOrder:async(req,res)=>{
        let productId= req.body.productId
        console.log("sidhiufasiugiudg"+productId);
        console.log(req.body.status);
        let response = await orderSchema.findOneAndUpdate(
          { _id: req.body['id'] , "products.productId":productId },
          { $set: { orderStatus: "Cancelled" } }
        );
        console.log(response);
        res.json({status:true})
      }




}