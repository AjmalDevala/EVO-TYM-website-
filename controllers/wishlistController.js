
const { default: mongoose } = require('mongoose');
const wishlistModel = require('../models/wishlistModel');
module.exports = {

    //============================WISHLISTGET====================================//
    wishlist: (req, res) => {
        let user = req.session.user;
        let userId = user._id;
        return new Promise(async (resolve, reject) => {
            let list = await wishlistModel.findOne({ userId: userId })
                .populate("productIds")
            if (list != null) {
                list = list.productIds
            } else {
                list = []
            }
            resolve(list)
        }).then((list) => {
            res.render('user/wishList', { login: true, user: req.session.user, list});
        })

    },
    //===================================ADD TO WISHLIST===============================//
    addToWishList: async (req, res) => {
        let productId = req.params.id
        let user = req.session.user;
        let user_id = user._id;
        let wishList = await wishlistModel.findOne({ userId: user_id });
        if (wishList) {
            await wishlistModel.findOneAndUpdate(
                { userId: user_id },
                { $addToSet: { productIds: productId } }
            );
            // res.redirect("/wishList");
            res.json({status:true})
        } else {
            const wish = new wishlistModel({
                userId: user_id,
                productIds: [productId]

            });
            wish.save().then(() => {
                res.json({status:true})

                // res.redirect("/wishList")
            });
        }

    },

    //==================================REMOVE=====================================//

    removeWishlistProduct: async (req, res) => {
        const id = req.params.id;
        let user = req.session.user;
        let userId = user._id;
        await wishlistModel.findOneAndUpdate({ userId }, { $pull: { productIds: id } })
            .then(() => {
                res.redirect("/wishList")
            })
    },




























}