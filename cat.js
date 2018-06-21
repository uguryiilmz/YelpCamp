var mongoose=require('mongoose')
mongoose.connect("mongodb://localhost/cat_app")

var catSchema=new mongoose.Schema({
  name:String,
  age:Number,
  temperament:String
})

var Cat=mongoose.model("Cat",catSchema);

// var george=new Cat({
//   name:"Ugur ",
//   age:10,
//   temperament:"Dizzy"
// })

// george.save(function(err,cat){
//   if(err){
//     console.log("Something went wrong")
//   }
//   else{
//     console.log(cat)
//   }
// })

Cat.create({
  name:"Missy",
  age:12,
  temperament:"Narcist"
},function(err,cat){
  if(err){
    console.log('Something went wrong')
  }
  else{
    console.log(cat)
  }
})


Cat.find({},function(err,cat){
  if(err){
    console.log("Something went wrong")
  }
  else{
    console.log('All the Cats')
    console.log(cat)
  }
})

//add cats to the DB

// retrieve cats from DB