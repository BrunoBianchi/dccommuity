const FormData = require("form-data");
var CLIENT_ID = process.env.CLIENT_ID
var  CLIENT_SECRET = process.env.CLIENT_SECRET
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = async function(app,disc_url,redirect) {
app.get("/callback", async (req, res) => {
    var uri = req.query.state;
    if (!req.query.code) throw new Error("NoCodeProvided");
    const code = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

    // ...

    const data = new FormData();

    data.append("client_id", CLIENT_ID);
    data.append("client_secret", CLIENT_SECRET);
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", redirect);
    data.append("scope", "identify guilds guilds.join");
    data.append("code", req.query.code);
    var response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: data,
    });

    const json = await response.json();
    res.cookie('token',json.access_token, { maxAge: json.expires_in, httpOnly: true })
    if (uri && uri != "undefined") return res.redirect(`/${uri}`);
    else return res.redirect("/dashboard");

  });

}