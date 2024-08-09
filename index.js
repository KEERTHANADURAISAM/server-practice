// import express
const express = require ("express")
// denote express la iruka obj app la store pani use
const app = express()
// bcrypt
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// cors
const cors =require ("cors")
// post use [] store the data
const usersData = [];
// add middleware
app.use(express.json())
app.use(cors({
    origin:"*"}))
app.get("/home",(req,res)=>{
    res.json("welocme")
})

let authendicate = (req,res,next)=>{
  
    console.log(req.headers)
    res.json("UNAUTHORIZED")
    // next()
}
// post user
app.post("/createUser",authendicate,(req,res)=>{
    console.log(req.body);
    // push data in user[]
    req.body.id=usersData.length+1
    usersData.push(req.body)
    res.json("user Created successfully")
})

// get user
app.get("/usersData",(req,res)=>{
    res.json(usersData)
})

// get by id

app.get("/user/:id",(req,res)=>{
    const userId=req.params.id;
    let User =usersData.find((itemid)=>itemid.id==userId)
    if(User){
    res.json(User)
    }else{
        res.json("user NOt Found")
    }
})

// put method
app.put('/user/:id',(req,res)=>{
    const userId =req.params.id
    const UserIndex = usersData.findIndex((itemid)=>itemid.id == userId)
    if(UserIndex != -1){
  Object.keys(req.body).forEach((item)=>{
usersData[UserIndex][item]= req.body[item]})
    res.json("done")
  }
  else{
    res.json("user NOt Found")
  }
})


// delete by id

app.delete('/user/:id',(req,res)=>{
    const userId =req.params.id
    const UserIndex = usersData.findIndex((itemid)=>itemid.id == userId)
    if(UserIndex != -1){
        usersData.splice(UserIndex,1)
        res.json("user deleted")
    }else{
res.json("user not found")
    }
})



// Authendication

// Register
app.post("/userRegister",async(req,res)=>{
    req.body.id=usersData.length+1
    usersData.push(req.body)
    let salt = await bcrypt.genSalt(10)
    console.log(salt)
    let hash =await bcrypt.hash( req.body.password,salt)
    console.log(hash)
    req.body.password=hash
    res.json("user created successfully")
})

// login user

app.post("/userLogin",async(req,res)=>{
let user = usersData.find((email)=>email.email == req.body.email)

if(user){
    let compare = await bcrypt.compare(req.body.password,user.password)
    console.log(compare)
    if(compare){
        let token = jwt.sign({id:user.id},"kkkkkkkk",{expiresIn:"1m"})
    res.json(token)
    
}else{
    res.json("something went wrong")
}
}else{
  
    res.json("user not found")
}
}) 



// check authendicate and call another fun


app.get("/usersData",authendicate,(req,res)=>{
    res.json(usersData)
})














// port strt to run
app.listen(process.env.PORT || 3005)