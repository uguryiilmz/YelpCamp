var express=require('express')
var router=express.Router()
var User=require('../model/users.js')
var campground=require("../model/campground.js")
var passport=require('passport')
var async=require("async")
var nodemailer=require("nodemailer")
var crypto=require("crypto")

router.get("/",function(req,res){
  res.render("landing")
})



router.get("/register",function(req,res){
  res.render('campground/register')
})


router.post('/register',function(req,res){
  var newUser=new User({username:req.body.username, firstname:req.body.firstname, lastname:req.body.lastname, email:req.body.email, avatar:req.body.avatar})
  if(req.body.secret_code==="secretcode123"){
    newUser.isAdmin=true
  }
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      req.flash("error",err.message)
      res.redirect('/register')
    }
    passport.authenticate("local")(req,res,function(){
      req.flash("success","Registered successfully")
      res.redirect('/campgrounds')
    })
  })

})


router.get('/login',function(req,res){
  res.render('campground/login')
})


router.post("/login" ,function(req,res,next){
  passport.authenticate("local",{
  successRedirect:'/campgrounds',
  failureRedirect:'/login',
  failureFlash:"Login failed. Invalid credentials",
  successFlash:"Welcome to YelpCamp " + req.body.username
  })(req,res)
})


router.get('/logout',function(req,res){
  req.logOut()
  req.flash("success","Log out successfully")
  res.redirect('/campgrounds')
})

router.get('/forgot', function(req, res) {
  res.render('user/forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'uguryiilmz95@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'uguryiilmz95@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('user/reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'uguryiilmz95@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'uguryiilmz95@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});

router.get("/users/:id",function(req,res){
  User.findById(req.params.id,function(err,foundedUser){
    if(err){
      req.flash("error",err.message)
    }
    campground.find().where('author.id').equals(foundedUser.id).exec(function(err,foundedData){
      if(err){
        req.flash("error",err.message)
        res.redirect("back")
      }
      console.log(foundedData)
      res.render("user/user",{user:foundedUser, campground:foundedData})
    })
    
  })
})

module.exports=router;