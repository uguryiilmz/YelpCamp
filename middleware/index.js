var middlewareObj={}
var yelpCamp=require("../model/campground")
var Comment=require("../model/comment")

middlewareObj.checkCampgroundUser=function(req,res,next){
  console.log(req)
  if(req.isAuthenticated()){
    yelpCamp.findById(req.params.id,function(err,foundedData){
      if(err){
        req.flash("error","Cannot find the campground")
        res.redirect('/campgrounds')
      }
      else{
        console.log(foundedData)
        if(foundedData.author.id.equals(req.user._id) || req.user.isAdmin){
          return next()
        }
        else{
          req.flash("error","You don't have a permission to do that")
          res.redirect('back')
        }
      }
    })
  }
  else{
    res.redirect("/login")
  }
}

middlewareObj.isLoggedIn=function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error',"You need to login, first")
  res.redirect('/login')
}

middlewareObj.checkCommentUser=function(req,res,next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id,function(err,foundedComment){
      if(err){
        console.log(err)
        res.redirect("back")
      }
      else{
        if(req.user._id.equals(foundedComment.author.id) || req.user.isAdmin){
          next()
        }
        else{
          req.flash("error","You do not have a permission to do that")
          res.redirect('back')
        }
      }
    })
  }
  else{
    res.redirect("/login")
  }
}
module.exports=middlewareObj