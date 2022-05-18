const Server = require("../modals/server");
module.exports = function(app) {
app.get("/",(req,res)=>{
   Server.find({},(err,result)=>{
      res.render(`home`,{data:result})

   })
})
}