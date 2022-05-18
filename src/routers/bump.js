const Server = require("../modals/server");
module.exports = function(app) {
app.post("/bump",(req,res)=>{
    console.log(req)
   Server.find({},(err,result)=>{
      res.render(`home`,{data:result})

   })
})
}