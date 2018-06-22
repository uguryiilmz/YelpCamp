var express=require('express')
var app=express()
var bodyParser = require('body-parser')
var mongoose=require('mongoose')
var yelpCamp=require('./model/campground.js')
var Comment=require('./model/comment.js')
var User=require("./model/users.js")
var seed=require('./seeds')
var methodOverRide=require("method-override")
var flash=require('connect-flash')
var passport=require('passport')
var LocalStrategy=require('passport-local')


var   campgroundRoute=require('./routes/campground.js')
      commentRoute=require('./routes/comment.js')
      indexRoute=require('./routes/index.js')

    



mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/campGrounds" )
//mongoose.connect("mongodb://localhost/campGrounds")
//mongoose.connect("mongodb://uguryilmaz:2562025h@ds151955.mlab.com:51955/camps")
app.set("view engine", "ejs")
app.use(methodOverRide('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'))

//seed() --seeding the database


app.use(require('express-session')({
  secret:'LOL',
  resave:'false',
  saveUninitialized:false
}))

app.use(flash())

// app.use(function(req,res,next){
//   res.locals.currentUser=req.user
//   next()
// })

app.locals.moment=require('moment')


//PASSPORT CONFIGURATION
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
  res.locals.currentUser=req.user
  res.locals.error=req.flash("error")
  res.locals.success=req.flash("success")
  next()
})


app.use("/campgrounds",campgroundRoute)
app.use("/campgrounds/:id/comments",commentRoute)
app.use(indexRoute)

var port=process.env.PORT || 3000;

app.listen(port || 3000,function(){
  console.log('YelpCamp Server has started')
})


