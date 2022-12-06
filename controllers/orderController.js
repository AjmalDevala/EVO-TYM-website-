const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const addressModel = require("../models/addressModel");
const moment = require("moment");


module.exports = {
//===============================================================================================================
// admin order management

    orderManagement :async (req , res) => {
      try{
        let user = await userModel.find()
        const orders =  await orderModel.find().sort({date:-1}).populate('products.productId').populate('userId')
        res.render('admin/orderManagement' ,{orders,user,moment})
      }catch{
        res.render("error")
      }      
      },

//===============================================================================================================
// admin edit order status 
      editOrderStatus: async (req, res) => {
        try{
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
      }catch{
        res.render("error")
      }

      },
//===============================================================================================================
// ADMIN downlode   invice
      invoice : async(req , res) => {
        try{
        const productId = req.params.orderId
        const orderId = req.params.productId
        const orders =  await orderModel.findOne({_id : orderId }).populate('products.productId').populate('address').populate('userId')            
        res.render('admin/invoice',{orders, moment })
        }catch{
          res.render("error")
        }
      },

//===============================================================================================================
// user side order management

      userOrderPage : async (req , res ) => {
        try{
        let userData = req.session.user;
        let userId = userData._id;
        let user = await userModel.findOne({ _id: userId });
        let order = await orderModel.find({ userId }).populate('products.productId').sort ({date : -1})
        
    
        if (req.session.userlogin) {
          res.render("user/userOrderPage", { order, login: true,user,moment});
        } else {
          res.render("user/userOrderPage", { order, login: false });
        }
      }catch{
        res.render("error")
      }
    
      },

//===============================================================================================================
// user order cancel
      orderCancel : async (req,res) => {
        try{
        const productid = req.params.prodId;
        const orderId = req.params.orderId;      
        await orderModel.updateOne({_id:orderId,"products._id":productid},{$set:{"products.$.orderStatus":"Cancelled"}})
        .then(() => {
        res.redirect("/userOrderPage");
        }).catch((err)=>{
            console.log(err+"errrrrr");
        })
      }catch{
        res.render("error")
      }

      }, 

//===============================================================================================================
// invoice


userInvoice : async(req,res)=>{
  try{
  const orderId = req.params.orderId
  const productId = req.params.productId
  const orders =await orderModel.findOne({_id : orderId })
  .populate('products.productId').populate('address').populate('userId')    
  res.render("user/userInvoice", {moment,orders})

}catch{
  res.render("error")
}
}



}