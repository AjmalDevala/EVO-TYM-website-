const userModel = require('../models/userModel');
const bcrypt = require("bcrypt");
const categoryModel = require('../models/categoryModel');
const productModel = require('../models/productModel');
const addressModel = require('../models/addressModel');
const nodemailer = require('nodemailer')
const { default: mongoose } = require('mongoose');
const bannerModel = require('../models/bannerModel');



//**************************************** OTP **********************************************************************/

var Name;
var Email;
var Phone;
var Password;


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        user: 'tevotym@gmail.com',
        pass: 'ayciviivpmecnmdf',
    }

});

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);
module.exports = {

    // ......................................................................
    // user home
    homeView: async (req, res) => {

        const banner = await bannerModel.find()
        let firstOne = await productModel.find({ status: "list" }).populate('category').sort({ date: -1 }).limit(8)
        let lastOne = await productModel.find({ status: "list" }).populate('category').sort({ date: 1 }).limit(8)

        if (req.session.userlogin) {
            res.render("user/home", {
                login: true,
                user: req.session.user,
                firstOne,
                lastOne,
                banner
            });
        } else {

            res.render("user/home", { login: false, firstOne, banner, lastOne })
        }

    },
    // ........................................................................................................
    // user login page
    loginView: (req, res) => {
        if (!req.session.userlogin) {
            res.render("user/login", {
                emailErr: req.session.emailErr,
                passErr: req.session.passErr
            });
        } else {
            res.redirect('/')
        }
    },
    // ..........................................................................................................
    //signup page
    signupView: (req, res) => {
        if (!req.session.userlogin) {
            res.render("user/signup");
        } else {
            res.redirect('/')
        }
    },


    //--------------------------------- otp ----------------------------------------------------------------------
    otp: async (req, res) => {

        Name = req.body.name
        Email = req.body.email
        Phone = req.body.phone
        Password = req.body.password

        const user = await userModel.findOne({ email: Email });

        if (!user) {
            // send mail with defined transport object
            var mailOptions = {
                to: req.body.email,
                subject: "Otp for registration is: ",
                html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                res.render('user/otp');
            });
        }
        else {
            res.redirect('/login_page')
        }
    },
    resendotp: (req, res) => {
        var mailOptions = {
            to: email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('otp', { msg: "otp has been sent" });
        });
    },

    verifyotp: (req, res) => {
        if (req.body.otp == otp) {
            const newUser = userModel({
                name: Name,
                email: Email,
                phone: Phone,
                password: Password
            });
            console.log(req.body);
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(() => {
                            res.redirect('/login_page')
                        })
                        .catch((err) => {
                            console.log(err);
                            res.redirect('/login_page')
                        })
                })
            })
        }
        else {
            res.render('user/otp', { msg: 'otp is incorrect' });
        }
    },
    //================================OTP===========================================================//
    //   ...........................................................................................//
    //  login page 

    login: async (req, res) => {

        const { email, password } = req.body;
        const user = await userModel.findOne({ $and: [{ email }, { status: "unBlocked" }] });
        if (!user) {
            req.session.emailErr = true;
            return res.redirect('/login_page');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.session.passErr = true;
            return res.redirect('/login_page');
        }
        req.session.user = user
        req.session.userlogin = true;
        res.redirect('/');

    },

    //=========================== // SESSION MIDDLE WARE===============================================================//

    userSession: async (req, res, next) => {
        let userData = req.session.user;
        if (userData) {
            let userId = userData._id;
            let user = await userModel.findById({ _id: userId });
            if (req.session.userlogin && user.status === "unBlocked") {
                next()
            } else {
                res.redirect('/login_page') 
            }
        } else {
            res.redirect('/login_page')
        }
    },



    // userSession: (req, res, next) => {
    //     if (req.session.userlogin) {
    //         next()
    //     } else {
    //         res.redirect('/login_page')
    //     }
    // },

    //=============================================================================//
    //showCategory user side all product

    showCategory: async (req, res) => {

        const category = await categoryModel.find({ status: "active" })
        const products = await productModel.find({ status: "list" }).populate('category')
        res.render("user/allProduct", {
            products, category, login: true,
            user: req.session.user
        })
    },

    singleProductPage: async (req, res) => {

        prodId = req.params.id;
        const pro = await productModel.findById({ _id: prodId }).populate('category')
        res.render("user/singleProduct", {
            pro, login: true,
            user: req.session.user,
        })
    },

    profilePage: async (req, res) => {
        let userData = req.session.user;
        let userId = userData._id;
        let user = await userModel.findOne({ _id: userId });
        let add = await addressModel.findOne({ userId: userId })
        if (add != null) {
            if (add.address.length > 0) {
                let num = add.address.length - 1;
                add = add.address[num];
            } else {
                add = [];
            }
        } else {
            add = [];
        }
        res.render("user/profilePage", { user, login: true, add });

    },

    addressPage: async (req, res) => {
        let userData = req.session.user;
        let userId = userData._id;
        let user = await userModel.findOne({ _id: userId });
        let allAddress = await addressModel.findOne({ userId: userId })
        if (allAddress != null) {
            allAddress = allAddress.address
        } else {
            allAddress = []
        }
        res.render("user/addressPage", { login: true, allAddress, user });
    },

    newAddress: async (req, res) => {
        const { fullName, address, city, state, pincode, phone } = req.body;
        let userData = req.session.user;
        let userId = userData._id;

        let exist = await addressModel.findOne({ userId: userId })

        if (exist) {
            await addressModel.findOneAndUpdate({ userId }, { $push: { address: { fullName, address, city, state, pincode, phone } } })
                .then(() => {
                    console.log(" one more address address added successfully");
                    res.redirect("/addressPage");
                })
        }
        else {
            const newaddress = new addressModel({ userId, address: [{ fullName, address, city, state, pincode, phone }] });
            await newaddress
                .save()
                .then(() => {
                    console.log(" new address added successfully");
                    res.redirect("/profilePage");
                })
                .catch((err) => {
                    console.log(err.message);
                    res.redirect("/profilePage");
                });
        }

    },
    deleteaddress: async (req, res) => {
        let id = req.params.id
        let userData = req.session.user;
        let userId = userData._id;
        await addressModel.findOneAndUpdate({ userId }, { $pull: { address: { _id: id } } })
            .then(() => {
                res.redirect("/addressPage")
            })
    },

    editProfile: async (req, res) => {
        const userId = req.params.id;
        const { name, email, phone } = req.body;
        const saveUserEdits = await userModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    name,
                    email,
                    phone,
                },
            }
        );
        await saveUserEdits.save().then(() => {
            res.redirect("/profilePage");
        });
    },






























    // .......................................................................
    // .....log out
    logOut: (req, res) => {

        req.session.loggedOut = true;
        req.session.destroy()
        res.redirect('/')
    }


}