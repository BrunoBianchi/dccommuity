var express = require('express')
var app = express()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require("dotenv").config()
var moment = require("moment")
const redirect = `http://localhost:3000/callback`;
const url = `http://localhost:3000`
var cookies = require('cookie-parser');
var bodyParser = require("body-parser");
const fs = require("fs")
var path = require('path') 
const axios = require('axios');
var CLIENT_ID = process.env.CLIENT_ID
var  CLIENT_SECRET = process.env.CLIENT_SECRET
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
const disc_url = `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify%20guilds&response_type=code`;
app.set('view engine', 'ejs')
.set('views', path.join(__dirname, '/src/views'))

.use(express.static(__dirname + '/src/public'))
.use(cookies())
.use(bodyParser.json())
.use(express.json())
.use((req, res, next) => {
    res.locals.url = req.originalUrl;
    res.locals.host = req.get("host");
    res.locals.protocol = req.protocol;
    res.locals.path_url = `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }`;
    next();
  })
  .use(/\/((?!callback).)*/,(req, res, next) =>{
      if(!req.cookies.token)  {
         res.locals.user = null
        next();
      }
    fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${req.cookies.token}`,
      },
    })
      .then((res) => res.json())
      .then(async (response) => { 
        req.user = response

        res.locals.user = response
         next();
      }).catch(err=>{
          console.log(err)
          res.send(`error:${err.toString()}`)
      })
  })
  .use(/\/((?!callback).)*/,(req, res, next) =>{
    if(!req.cookies.token)  {
       res.locals.user = null
      next();
    }
  fetch("https://discordapp.com/api/v6/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${req.cookies.token}`,
    },
  })
    .then((res) => res.json())
    .then(async (response) => { 
    req.guilds = response
      res.locals.guilds = response
       next();
    }).catch(err=>{
        console.log(err)
        res.send(`error:${err.toString()}`)
    })
})
app.locals.moment = moment; 
app.locals.md = md;
var server = app.listen(3000,()=>{
    console.log("App listening on port 3000")
})
const io = require('socket.io')(server);
const { Permissions,Intents,MessageEmbed,Client } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILD_PRESENCES ,Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});
fs.readdir("./src/routers/",(err,files)=>{
    if(files.length <= 0) return
    files.forEach(file => {
        try{
            require(`./src/routers/${file}`)(app,url,client)
            console.log(`Router ${file} online `)
        }catch(error) {
            console.log(`Router error ${file}: ${error}`)
        }
    });
})
fs.readdir("./src/events/",(err,files)=>{
    if(files.length <= 0) return
    files.forEach(file => {
        const event = require(`./src/events/${file}`);
        try{
            client.on(`${file.split(".js")[0]}`,(...args)=>{
                event.run(...args)
            })
            console.log(`Event ${file} online `)
        }catch(error) {
            console.log(`Event error ${file}: ${error}`)
        }
    });
})
fs.readdir("./src/api/",(err,files)=>{
    if(files.length <= 0) return
    files.forEach(file => {
        try{
            require(`./src/api/${file}`)(app,disc_url ,redirect )
            console.log(`Api ${file} online `)
        }catch(error) {
            console.log(`Apierror ${file}: ${error}`)
        }
    });
})
client.login(process.env.token)
client.on("ready",()=>{
    console.log(`Logged in as ${client.user.tag}!`);
})