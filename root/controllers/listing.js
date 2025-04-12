const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
 };


module.exports.new = (req,res)=>{
    //  console.log(req.user);
    //  if(!req.isAuthenticated()){
    //      req.flash("error","You need to login first!");
    //      return res.redirect("/login");
    //  }
     res.render("listings/new.ejs");
 };


module.exports.show = async (req,res)=>{
      let {id}= req.params;
     const listing= await Listing.findById(id)
     .populate({path:"reviews", populate:{path:"author"}})
     .populate("owner");
     if(!listing){
         req.flash("error","Listing does not exist!");
         res.redirect("/listings");
     } 
     res.render("listings/show.ejs",{listing});
  };


module.exports.create = async (req,res,next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for Listing!");
    // }

   /* let result=listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }  */
    
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
     })
    .send();
            
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing created successfully!");
    res.redirect("/listings");
};


module.exports.edit = async(req,res)=>{
     let {id}= req.params;
     const listing= await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
     let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_170,w_250");
     res.render("listings/edit.ejs", { listing, originalImageUrl });
 };


module.exports.update = async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for Listing!");
    // }
    let {id}= req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    // await listing.save();
   } 
   let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
   })
   .send();

   listing.geometry = response.body.features[0].geometry;
   await listing.save();

   req.flash("success","Listing updated successfully!");
   res.redirect(`/listings/${id}`);
};
  

module.exports.destroy = async(req,res)=>{
    let {id}=req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted successfully!");
    res.redirect("/listings");
};