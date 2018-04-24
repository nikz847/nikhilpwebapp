var express  = require("express"),
    router   = express.Router(),
    User     = require("../models/user"),
    passport = require("passport");

//Landing Page
router.get("/", function(req, res){
    res.render("landing");
});

//Shows form for registering
router.get("/register", function(req, res) {
    res.render("register");
});

//Registers and logs in the user
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome and Thanks for signing up " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Shows form for login
router.get("/login", function(req, res){
    res.render("login");
});

//Handles login logic
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//Handles logout logic
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;