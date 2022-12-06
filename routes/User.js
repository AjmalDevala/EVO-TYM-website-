
const express = require("express");
const controller = require("../controllers/userController");
const wlcontroller=require("../controllers/wishlistController")
const cartcontroller=require("../controllers/cartController")
const checkOutcontroller=require("../controllers/checkOutController")
const orderController=require("../controllers/orderController")

const router = express.Router();
//................................................................................
//get method 
router.get("/",controller.homeView);
router.get("/login_page",controller.loginView);
router.get("/signup_page", controller.signupView);
router.get("/logout",controller.logOut)
router.get("/contact",controller.contact)
router.get('/showCategory',controller.userSession,controller.showCategory);
router.get('/singleProduct/:id',controller.userSession,controller.singleProductPage)
router.get('/wishList',controller.userSession,wlcontroller.wishlist)
router.get("/addToWishList/:id",controller.userSession,wlcontroller.addToWishList)
router.get("/removeWishlistProduct/:id",wlcontroller.removeWishlistProduct)
router.get('/cartPage',controller.userSession,cartcontroller.cart)
router.get("/addToCart/:id",controller.userSession,cartcontroller.addToCart)
router.get("/removeCart/:id/:price/:quantity",controller.userSession,cartcontroller.removeCart)
router.get("/profilePage",controller.userSession,controller.profilePage)
router.get("/addressPage",controller.userSession,controller.addressPage)
router.get("/deleteaddress/:id",controller.deleteaddress)
router.get("/confirmationPage",checkOutcontroller.confirmationPage)
router.get("/checkOutPage",controller.userSession,checkOutcontroller.checkOutPage)
router.get("/userOrderPage",controller.userSession,orderController.userOrderPage)
router.get("/userInvoice/:orderId/:productId",controller.userSession,orderController.userInvoice)
router.get("/orderCancel/:orderId/:prodId",orderController.orderCancel )

//...............................................................................
//post method
router.post("/login",controller.login)
router.post("/otp",controller.otp)
router.post('/resendotp', controller.resendotp)
router.post('/verifyotp',controller.verifyotp)
router.post('/singleProductPage/:id', controller.singleProductPage)
router.post ("/incQuantity/:id/:price",cartcontroller.incQuantity)
router.post ("/decQuantity/:id/:price",cartcontroller.decQuantity)
router.post('/newAddress', controller.newAddress)
router.post('/editProfile/:id',controller.editProfile);
router.post('/changeAddress',checkOutcontroller.checkOutPage);
router.post('/checkoutNewAddress',checkOutcontroller.checkoutNewAddress)
router.post('/placeOrder',controller.userSession,checkOutcontroller.placeOrder);
router.post('/verifyPayment',controller.userSession,checkOutcontroller.verifyPayment);
// router.post('/change-quantity' ,cartcontroller.changeCartQuantity)





//.............................................................................
//export
module.exports = router;
