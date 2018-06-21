var express=require('express')
var router=express.Router({mergeParams:true})
var yelpCamp=require('../model/campground.js')
var Comment=require('../model/comment.js')
var middleware=require("../middleware")

router.get("/new",middleware.isLoggedIn,function(req,res){
  yelpCamp.findById(req.params.id,function(err,campground){
    if(err){
      console.log(err)
      res.redirect('/login')
    }
    else{
      res.render('comments/new',{campground:campground})
    }
  })
 
})


router.post("/",middleware.isLoggedIn,function(req,res){
    yelpCamp.findById(req.params.id,function(err,campground){
      if(err){
        console.log(err)
        res.redirect('/campgrounds')
      }
      else{
        Comment.create({
          text:req.body.comment.text,
          author:{
            id:req.user._id,
            username:req.user.username
          }
        },function(err,comment)
        {
          if(err){
            console.log(err)
          }
          else{
            // comment.author.username=req.user.username
            // console.log('id is ',req.user.id)
            // comment.author.id=req.user._id
            // comment.save()
            campground.comment.push(comment)
            campground.save()
            console.log(comment)
            res.redirect('/campgrounds/'+campground._id)
          }

        })
      }
    })
})

router.get("/:comment_id/edit",middleware.checkCommentUser,function(req,res){
  Comment.findById(req.params.comment_id,function(err,foundedComment){
    if(err){
      res.redirect("back")
    }
    else{
      res.render("comments/edit",{campground_id:req.params.id, comment:foundedComment})
    }
  })
})

router.put("/:comment_id",middleware.checkCommentUser,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedData){
    if(err){
      req.flash("Cannot find the comment")
      res.redirect("back")
    }
    else{
      req.flash("success","Comment changed succesfully")
      res.redirect("/campgrounds/"+ req.params.id)
    }
  })
})

router.delete("/:comment_id",middleware.checkCommentUser,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err){
      req.flash("Cannot find the comment")
      res.redirect('back')
    }
    else{
      res.redirect("/campgrounds/"+ req.params.id)
    }
  })
})


// function checkCommentUser(req,res,next){
//   if(req.isAuthenticated()){
//     Comment.findById(req.params.comment_id,function(err,foundedComment){
//       if(err){
//         console.log(err)
//         res.redirect("back")
//       }
//       else{
//         if(req.user._id.equals(foundedComment.author.id)){
//           next()
//         }
//         else{
//           res.redirect('back')
//         }
//       }
//     })
//   }
//   else{
//     res.redirect("/login")
//   }
// }


module.exports=router;
