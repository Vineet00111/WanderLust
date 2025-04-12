const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");

const userController = require("../controllers/user.js");


//signup
router.get("/signup", userController.getSignup);


router.post("/signup", wrapAsync(userController.postSignup));



//login
router.get("/login", userController.getLogin);


router.post("/login",
     saveRedirectUrl,
     passport.authenticate("local",
       {
        failureRedirect: "/login",
        failureFlash: true
       } ),
     userController.postLogin
    );



//logout
router.get("/logout", userController.getLogout);



module.exports=router;