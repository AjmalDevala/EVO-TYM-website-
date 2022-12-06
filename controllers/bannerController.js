const bannerModel = require('../models/bannerModel');
module.exports = {

//===============================================================================================================
// bannner render page
bannerPage : async(req,res)=>{
    banner = await bannerModel.find({})
    res.render("admin/bannerPage",{banner,index :1})
},


//===============================================================================================================
// new banner
newBanner: async(req,res)=>{
    const {tittle,text}=req.body
    const image =req.file
    const newBanner =await bannerModel({
        tittle,
        text,
        image: image.filename,
    })
    await newBanner.save()
    .then(()=>{
        res.redirect('/admin/bannerPage')
    })
},
//===============================================================================================================
// deleteBanner
deleteBanner : async (req,res)=>{
    let id = req.params.id
    await bannerModel.findByIdAndDelete({_id:id})
    .then(()=>{
        res.redirect("/admin/bannerPage")
    })  
  },
//===============================================================================================================
// edit banner
  editBannerPage :async(req,res)=>{
    const id =req.params.id
    banner = await bannerModel.findOne({_id:id})
    res.render("admin/editBanner",{banner})
  },
//===============================================================================================================
// update banner
  updatebanner: async(req, res)=>{
    if(req.file){
        let image =req.file
        const {tittle,text}=req.body
        await bannerModel.updateOne({_id: req.params.id},{$set: {image:image.filename,tittle,text}})
        res.redirect('/admin/bannerPage')
    }

  },

//===============================================================================================================
                                      //end


}