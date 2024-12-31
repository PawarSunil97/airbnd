const express= require("express");
const app = express();
var session = require('express-session')

app.use(session({secret:"mysupersecreates",resave: false, saveUninitialized:true }));
app.get("/test",(req,res)=>{
    res.send("test successfully")
});
app.get("/requestsend",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{

        req.session.count=1;
    }
    res.send(`you send the request ${ req.session.count}`)
})
app.listen(3000,()=>{
    console.log("server is running on port 3000");
})