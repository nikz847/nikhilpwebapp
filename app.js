var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    seedDB         = require("./seed"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    localStrategy  = require("passport-local"),
    methodOverride = require("method-override");
    
//Requiring models for our entities
var Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user");
    
//Requiring Routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended :true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret: "Nikhil is a bear",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("YelpCamp Server is listening");
});