var functions = require("../functions/functions")
const Server = require("../modals/server");
module.exports = function(app,url,client) {
    app.get("/dashboard",functions.ensureAuthenticated,(req,res)=>{
       res.render(`home`)
    })
    app.get("/dashboard/:id",functions.ensureAuthenticated, (req,res)=>{
        var id = req.params.id
        Server.findOne({id:req.params.id}, (err,result)=>{
            if(result === null)  return res.redirect(
                `https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=bot&permissions=379969&response_type=code&redirect_uri=${url}/dashboard/callback/config&guild_id=${id}`
              );
            var tags = []
            result.tags.forEach(tag=>{
                tags.push(tag.name)
            })
              res.render("dashboard",{data:result,tags:tags})
        })
    })
    app.get("/dashboard/callback/config",functions.ensureAuthenticated, async(req,res)=>{
        var server = client.guilds.cache.get(req.query.guild_id)
        if(server === undefined) return res.redirect("/")
       var channel = server.channels.cache.find(channel=>channel.type === "GUILD_TEXT")
       if(!channel) return res.redirect("/")
       var invite = await channel.createInvite({
        maxAge: 0,
        maxUses: 0 
      });
            server.tags=[{name:'community'}]
            server.invite = invite.url
            Server.findOne({id:server.id},async (err,result)=>{
                if(result!= undefined) return 
                else {
                    await Server.create(server).then(result=>{
                        console.log(`Criando ${server.name}`)
                        res.redirect(`/dashboard/${result.id}`)
                    }).catch(err=>{
                        if(err) return  res.redirect(`/`)
                    })
                }
            })

    })
    app.post("/dashboard/:id/updateTags",functions.ensureAuthenticated, async(req,res)=>{
        var tags = []
        req.body.tags.split(",").forEach(tag => {
            tags.push({name:tag})
        });
        if(!req.params.id) return res.json("no id found!")
        Server.findOne({id:req.params.id}, (err,result)=>{
            result.tags = tags
            result.save()
            return res.json("tags updated!")
        })

    })
    }