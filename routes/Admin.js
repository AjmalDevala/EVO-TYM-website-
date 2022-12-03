const { Router } = require("express");
const express = require ("express")
const controller = require("../controllers/adminController");
const bannerController=require("../controllers/bannerController")
const orderController=require("../controllers/orderController")
const { collection } = require("../models/adminModel");
const router = express.Router();


//...........................................................
// Admin view  Get routers 
router.get("/", controller.loginView);
router.get("/home",controller.adminSession,controller.homeView);
router.get("/allUser",controller.allUserVIew);
router.get ('/categoriesPage',controller.categoriesPage)
router.get('/logOut',controller.logOut)
router.get('/addProductPage',controller.addProductPage)
router.get('/allProductPage',controller.allProductPage)
router.get('/bannerPage',bannerController.bannerPage)
router.get('/deleteBanner/:id',bannerController.deleteBanner)
router.get('/orderManagement',controller.adminSession,orderController.orderManagement)
router.get('/invoicePage/:orderId/:productId',controller.adminSession,orderController.invoice)

//..............................................................
//Admin post routers
router.post ('/login',controller.login)
router.post ('/blockUser/:id',controller.blockUser)
router.post ('/unblockUser/:id',controller.unblockUser)
router.post ("/newCategory",controller.newCategory)
router.post ('/deleteCategory/:id',controller.deleteCategory)
router.post ('/activeCategory/:id',controller.activeCategory)
router.post ('/inActiveCategory/:id',controller.inActiveCategory)
router.post ('/newProduct',controller.newProduct)
router.post ('/listProduct/:id',controller.listProduct)
router.post ('/unListProduct/:id',controller.unListProduct)
router.post('/editProductPage/:id',controller.editProductPage)
router.post ('/editProduct/:id',controller.editProduct)
router.post ('/newBanner',bannerController.newBanner)
router.post('/editBannerPage/:id',bannerController.editBannerPage)
router.post('/updatebanner/:id',bannerController.updatebanner)
router.post('/changeOrderStatus',orderController.editOrderStatus)



module.exports = router;