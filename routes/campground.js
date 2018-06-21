var express=require('express')
var router=express.Router();
var yelpCamp=require('../model/campground.js')
var middleware=require('../middleware')

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

router.get("/",function(req,res){
  var errorMsg;
  if(typeof(req.query.search)==="undefined"){
    yelpCamp.find({},function(err,camps){
      if(err){
        console.log('Something went wrong in main campgrounds')
      }
      else{
        res.render("campground/index",{campground:camps, currentUser:req.user,message:errorMsg})
      }
      
    })
  }
  else{
    console.log('query is',req.query.search)
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    yelpCamp.find({name:regex},function(err,camps){
      if(err){
        console.log('Something went wrong ')
      }
      else{
        //console.log(camps.length)
        if(camps.length<1){
          errorMsg="Campground you searched for cannot be found"
          res.render("campground/index",{campground:camps, currentUser:req.user, message:errorMsg})
        }
        res.render("campground/index",{campground:camps, currentUser:req.user, message:errorMsg})
      }
      
    })
  }
  //console.log(req.user)

})


//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    yelpCamp.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds/"+newlyCreated._id );
        }
    });
  });
});



router.get("/new",middleware.isLoggedIn,function(req,res){
  res.render("campground/new.ejs")
})


//Show more info about one campground
router.get("/:id",function(req,res){
  yelpCamp.findById(req.params.id).populate('comment').exec(function(err,foundedData){
    if(err){
      console.log('Something went wrong')
      console.log(err)
    }
    else{
      //console.log('Data is founded')
      //console.log(foundedData)
      res.render("campground/show",{campground:foundedData})
    }
  })
})


router.get('/:id/edit',middleware.checkCampgroundUser,function(req,res){
    yelpCamp.findById(req.params.id,function(err,foundedData){
          res.render("campground/edit",{campground:foundedData})
    })
})

router.put("/:id",middleware.checkCampgroundUser,function(req,res){
  geocoder.geocode(req.body.location,function(err,data){
    if(err){
      req.flash("error","invalid address")
      return res.redirect("back")
    }
    var lat=data[0].latitude
    var lng=data[0].longitude
    var location=data[0].formattedAddress

    req.body.campground.lat=lat
    req.body.campground.lng=lng
    req.body.campground.location=location

    yelpCamp.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedData){
      if(err){
        res.redirect('/campgrounds')
      }
      else{
        res.redirect('/campgrounds/' + req.params.id)
      }
    })
  })
  })

  router.delete("/:id",middleware.checkCampgroundUser,function(req,res){
    yelpCamp.findByIdAndRemove(req.params.id,function(err){
      if(err){
        req.flash("error",'Cannot find the campground')
        res.redirect("back")
      }
      else{
        req.flash('success',"Deleted successfully")
        res.redirect('/campgrounds/')
      }
    })
  })

 function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};





module.exports=router;