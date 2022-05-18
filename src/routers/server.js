const Server = require("../modals/server");

module.exports= function(app,url,client) {
    app.get("/server/:id",async (req,res)=>{
        var id = req.params.id
        var guild = await client.guilds.cache.get(id)
        if(!guild ) return res.json("No server Found!")
        if(!id) return res.redirect("/")
        Server.findOne({id:id},(err,result)=>{
            if(!result) return res.json("No server Found!")
            guild.content = result.content
            guild.joinedAt = result.content
            guild.NSFW = result.NSFW
            guild.votes = result.votes
            guild.tags = result.tags
            guild.lastBump = result.lastBump
            res.render("server.ejs",{guild})
        })
    })
    app.get("/server/:id/join",(req,res)=>{
        var id = req.params.id
        if(!id) return res.redirect("/")
        Server.findOne({id:id},(err,result)=>{
            if(!result) return res.json("No server Found!")
            res.redirect(result.invite)
        })
    })
}