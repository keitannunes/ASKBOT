const http = require("http");
const express = require("express");
const superagent = require("superagent");
const app = express();
var request = require("request");
var $ = require("jquery");
const fs = require("fs");
var path = require("path");

var htmlSource = fs.readFileSync("public/index.html", "utf8");
// http://expressjs.com/en/starter/static-files.html
//VERY IMPORTANT!!!!
require('dotenv').config();
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/");
});
app.get("/test", (request, response) => {
  response.sendFile(__dirname + "/views/game.txt");
});

// VERY IMPORTANT!!!!!

const Discord = require("discord.js");
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();
client.channels.cache.get()
const newUsers = [];
// Here we load the config.json file that contains our token and our prefix values.
// config.token contains the bot's token
// config.prefix contains the message prefix.
console.log("Loading... Please wait");
console.log("creating Web server")
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
});
server.listen(3000);

var error1 = setTimeout(function() {
  console.log("\x1b[41m", "ERROR: UNABLE TO CONNECT TO DISCORD SERVER");
}, 10000);
client.on("ready", () => {
  clearTimeout(error1);
  console.clear();

  console.log(
    `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`
  );
  var usersize = client.users.size;
  console.log("DO NOT CLOSE THIS WINDOW");
  console.log("");
  console.log("Log:");
  console.log("");
  client.user.setActivity(fs.readFileSync("views/game.txt", "utf8"));
  var activity = fs.readFileSync("views/game.txt", "utf8");
  fs.writeFile("views/usrs.txt", client.users.size, err => {
    if (err) throw err;
  });
  fs.writeFile("views/channels.txt", client.channels.size, err => {
    if (err) throw err;
  });
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on("guildMemberRemove", member => {
  const guild = member.guild;
  if (newUsers[guild.id].has(member.id)) newUsers.delete(member.id);
});

function clean(text) {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}

//FUKUNAKA BOT STATUS
var url = "http://worldclockapi.com/api/json/est/now";
var time = "test";
request(
  {
    url: url,
    json: true
  },
  function(error, response, body) {
    if (!error && response.statusCode === 200) {
      refreshwebsite(activity, body.currentDateTime);
      fs.writeFile("views/lastupdate.txt", body.currentDateTime, err => {
        if (err) throw err;
      });
    }
  }
);
var outputdate = function outputdate() {
  var url = "http://worldclockapi.com/api/json/est/now";
  var time = "test";
  request(
    {
      url: url,
      json: true
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        return body.currentDateTime;
      }
    }
  );
};
var refreshwebsite = function refreshwebsite(activity, time) {
  var usern = fs.readFileSync("views/usrs.txt", "utf8");
  var channeln = fs.readFileSync("views/channels.txt", "utf8");
  var html =
    `<!doctype html>\
<html>\
    <head\>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
        <title>GROGGYGG BOT JIFSFFDSASD</title>\
      <link rel="stylesheet" href="style.css">\
       <link id="favicon" rel="icon" href="https://cdn.glitch.com/7c4f95fd-9b66-44c5-af92-c9af5c67ebc4%2Fcsgo_ct_icon_alt_ehB_icon.ico?1549662678433" type="image/x-icon">\
<script src="../jquery-1.7.1.min.js"></script>\
    </head>\
    <body>\
      \
        <h1>GROGGGG BOTTTTTT</h1>\
      <table>\
  <tr>\
    <th class="h2">Status:</th>\
    <th id="active" class="h2">Active</th>\
  </tr>\
  <tr>\
     <td class="h2">Users:</td>\
    <td class="h2">` +
    usern +
    `</td>\
  </tr>\
   <tr>\
   <td class="h2">Channels:</td>\
    <td class="h2">` +
    channeln +
    `</td>\
  </tr>\
   <tr>\
   <td class="h2">Bot Activity:</td>\
    <td class="h2" id="test">` +
    activity +
    `</td>\
  </tr>\
</table>\
  <br/>\
  <span class="update">Bot last refreshed: ` +
    time +
    ` EST</span>\
 <br/>\
  <span class="update" style="color=red;">Dashboard last updated: Having some errors with this function</span>\
<script src="text.js"></script>\
    </body>\
</html>`;
  fs.writeFile("public/index.html", html, err => {
    if (err) throw err;
  });
};
var activity = fs.readFileSync("views/game.txt", "utf8");

//JSDOM DASHBOARD
/*
var path = require("path");
var jsdom = require("jsdom");

var htmlSource = fs.readFileSync("views/index.html", "utf8");
function documentToSource(doc) {
    // The non-standard window.document.outerHTML also exists,
    // but currently does not preserve source code structure as well

    // The following two operations are non-standard
    return doc.doctype.toString()+doc.innerHTML;
}

function call_jsdom(source, callback) {
    jsdom.env(
        source,
        [ 'jquery-1.7.1.min.js' ],
        function(errors, window) {
            process.nextTick(
                function () {
                    if (errors) {
                        throw new Error("There were errors: "+errors);
                    }
                    callback(window);
                }
            );
        }
    );
}
call_jsdom(htmlSource, function (window) {
    var $ = window.$;
    var $ = require('jquery')(window);
    var title = $("title").text();
    $("h1").text(title);
    console.log(documentToSource(window.document));
});
*/
client.on("message", async message => {

  var messageLower = message.content.toLowerCase();
  const args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.author.bot) return;
  if (!messageLower.includes("g?")) return;
  //COMMANDS!!!!!!
  switch (command) {
    case "dtq":
      const { body } = await superagent.get(
        "https://api.whatdoestrumpthink.com/api/v1/quotes/random"
      );
      message.channel.send(body.message);
      break;
    case "help":
      message.reply("You need help? Fuck you!");
      console.log(`${message.author.username} needed help but didn't get any LOL!!!!XD`);
      break;
    case "say":
      const sayMessage = args.join(" ");
      message.delete().catch(O_o => { });
      message.channel.send(sayMessage);
          console.log(`${message.author.username} made the bot say: ${sayMessage}`);
      break;
    case "ping":
      const hello = await message.channel.send("Ping?");
      console.log(`${message.author.username} used ping`);
      hello.edit(
        `Pong! Latency is ${hello.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`
      );
      break;
    case "changegame":
      var text = message.content.substr("g?changegame ".length);
      fs.writeFile("views/game.txt", text, err => {
        if (err) throw err;
      });
      client.user.setActivity(text);
      message.channel.send(`changed bot's activity to: ${text}`);
          console.log(`${message.author.username} changed game to ${text}`);
      var time = fs.readFileSync("views/lastupdate.txt", "utf8");
      refreshwebsite(text, time);
      return;
      break;
    case "grog":
      message.channel.send("GROG IS DA WORST!");
      console.log(`${message.author.username} used grog`);
      break;
    case "avatar":
      var user = message.mentions.users.first();
      message.channel.send("Avatar:", {
        file:
          user.avatarURL // Or replace with FileOptions object
      });
      break;
    case "troll":
      message.channel.send("You just got trolled", {
        file:
          "https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png" // Or replace with FileOptions object
      });
      console.log(`${message.author.username} used troll`);
      break;
    
  case "dm":
    if (message.mentions.members.size > 0){
    var dmtext = message.content.substr(message.mentions.users.first().id.length+10);
    var dm = `${message.author} sent you a DM: ${dmtext}` 
    var dmid = message.mentions.users.first().id
    message.channel.send("Done!")
      client.users.cache.get(dmid).send(dm);
    console.log(`${message.author.username} DM'd ${message.mentions.users.first().username}: ${dmtext}`)
    }

    else{
      message.reply("Mention someone idiot!")
      console.log(`${message.author.username} tried to DM someone but forgot to mention someone`)
    }

    break;
    case "stealthdm":
        if (message.mentions.members.size > 0){
    var dmtext = message.content.substr(message.mentions.users.first().id.length+16);
    var dm = `Someone sent you a DM: ${dmtext}` 
    var dmid = message.mentions.users.first().id
    message.delete().catch(O_o => { });
      client.users.cache.get(dmid).send(dm);
    console.log(`${message.author.username} Stealth DM'd ${message.mentions.users.first().username}: ${dmtext}`)
    }

    else{
      message.author.send("Mention someone idiot!")
      console.log(`${message.author.username} tried to stealth DM someone but forgot to mention someone`)
      message.delete().catch(O_o => { });
    }
  break;
    default:
      message.reply("You stupid fuck!!!");
      console.log(`${message.author.username} is retarted`);
  }
  /*
  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const hello = await message.channel.send("Ping?");
    console.log(message.author);
    hello.edit(
      `Pong! Latency is ${hello.createdTimestamp -
        message.createdTimestamp}ms. API Latency is ${Math.round(
        client.ping
      )}ms`
    );
  }
  if (command === "changegame") {
    var text = message.content.substr("g?changegame ".length);
    fs.writeFile("views/game.txt", text, err => {
      if (err) throw err;
    });
    client.user.setActivity(text);
    message.channel.send(`changed bot's activity to: ${text}`);
    console.log("readFileSync complete");
    var time = fs.readFileSync("views/lastupdate.txt", "utf8");
    refreshwebsite(text, time);
    return;
  }
  if (command === "grog") {
    message.channel.send("GROG DA BEST!!!!!!");
  }
  if (command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o => {});
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }
  if (command === "dtq") {
    const { body } = await superagent.get(
      "https://api.whatdoestrumpthink.com/api/v1/quotes/random"
    );
    message.channel.send(body.message);
  }
  */
});
client.login();