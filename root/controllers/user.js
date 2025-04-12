const User = require("../models/user.js");


//signup

module.exports.getSignup = (req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.postSignup = async(req,res,next) =>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
              return next(err);
            }
            req.flash("success","Welcome to WanderLust, you are signed up successfully!");
            res.redirect("/listings");
        });
     } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    } 
};


//login

module.exports.getLogin = (req,res)=>{
    res.render("users/login.ejs");
 };

module.exports.postLogin = async(req,res)=>{
    req.flash("success","Welocome to WanderLust, you are logged in!");
    let originalUrl = res.locals.originalUrl || "/listings" ;
    res.redirect(originalUrl);
};



//logout

module.exports.getLogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out successfully!");
        res.redirect("/listings");
    });
};