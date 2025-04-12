const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
// const upload = multer({ dest: "uploads/"});
const upload = multer({storage});



//index route
router.get("/", wrapAsync(listingController.index));
 

 //New Route
 router.get("/new", isLoggedIn, listingController.new );


 //show route
router.get("/:id", wrapAsync(listingController.show));
 

 //Create route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.create));

// router.post("/", upload.single("listing[image]"), (req,res)=>{
//   res.send(req.file);
// });


 //Edit route
 router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

 
 //Update route
 router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.update));

   
 //Destroy route
 router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroy));


 module.exports= router;