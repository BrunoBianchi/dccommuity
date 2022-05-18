const Server = require("../modals/server");
module.exports = function(app) {
app.get("/search",(req,res)=>{
    var query = req.query
    Server.find({},(err,result)=>{
      const filteredServers = []
       result.filter(server=>{
        var i = 0
          for(key in query) { 
          if(!query.tags) {
            if(server[key] === undefined ) return 
            if( Number(i) < Object.keys(query).length && server[key].toString() === query[key].toString()) {
              i++
              if(server[key].toString() === query[key].toString() && Number(i) >= Object.keys(query).length) {
                filteredServers.push(server)
              }

            }
          }else {
            if(key != "tags") {
              if( Number(i) < Number(Object.keys(query).length -1) && server[key].toString() === query[key].toString()) {
                i++
                if(server[key].toString() === query[key].toString() && server.tags.find(tag=>tag.name.toLowerCase() === query.tags.toLowerCase())&& Number(i) >= Number(Object.keys(query).length -1)) {
                  filteredServers.push(server)

                }
              }
            }
            if(key === "tags" && Object.keys(query).length <= 1) {
                if(server.tags.find(tag=>tag.name.toLowerCase() === query.tags.toLowerCase())) return  filteredServers.push(server)
            }
          }
  
      }
    })
    res.send(JSON.stringify(filteredServers))
  })

})
}