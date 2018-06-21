var mongoose=require('mongoose')

var campSchema=new mongoose.Schema({
  name:String,
  image:String,
  price:String,
  description:String,
  lat:Number,
  lng:Number,
  location:String,
  createdAt:{type:Date, default:Date.now},
  comment: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Comments'
    }
  ],
  author:{
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    username:String,
  },
  
})

module.exports=mongoose.model("CampGrounds",campSchema)