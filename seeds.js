var mongoose=require('mongoose')
var CampGround=require('./model/campground')
var Comment=require('./model/comment')


var data=[

  {
    name:"Cloud's Rest",
    image:'https://pixabay.com/get/eb33b5082af2023ed1584d05fb1d4e97e07ee3d21cac104497f8c670aee4b0b9_340.jpg',
    description:'bla bla'


  },
  {
    name:"Desert Mesa",
    image:'https://farm9.staticflickr.com/8444/7930246198_529eb829df.jpg',
    description:'blwqea bla'
  },
  {
    name:"Death Valley",
    image:'https://farm6.staticflickr.com/5187/5623797406_ea91016ac3.jpg',
    description:'bla ewqbla'
  }
]

function seedDB(){
  CampGround.remove({},function(err){
    // if(err){
    //   console.log("error happened")
    // }
    // console.log('removed')
    // data.forEach(function(seed){
    //   CampGround.create(seed,function(err,campground){
    //     if(err){
    //       console.log(err)
    //     }
    //     else{
    //       console.log('added')
    //       Comment.create(
    //         {
    //           text:'This place is great, but i wish there was internet',
    //           author:'Homer'
    //         },function(err,comment){
    //           if(err){
    //             console.log('error')
    //           }
    //           else{
    //             campground.comment.push(comment)
    //             campground.save();
    //             console.log('created comment')
    //           }
    //         }
    //       )
    //     }
    //   });
    // })
  })
}

module.exports=seedDB;