const http = require("http");
const fs = require("fs");
const discord = require("discord.js");
const client = new discord.Client();
const axios = require("axios")
require('dotenv').config();

client.channels.cache.get()
console.clear()
console.log("Loading... Please wait");
console.log("creating Web server")
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
});
server.listen(3000);

const error1 = setTimeout(function () {
  console.log("\x1b[41m", "ERROR: UNABLE TO CONNECT TO DISCORD SERVER");
}, 10000);
client.on("ready", () => {
  clearTimeout(error1);
  console.log("");
  console.log("Log:");
  console.log("");
  client.user.setActivity(fs.readFileSync("views/game.txt", "utf8"));
});

client.on("message", async message => {

  const messageLower = message.content.toLowerCase();
  const args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/g);

  const command = args.shift().toLowerCase();
  if (message.author.bot) return;
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;
  const output = await message.channel.send("Thinking..."); //Response that we are gonna edit
  //COMMANDS!!!!!!
  switch (command) {
    case "ping":
      console.log(`${message.author.username} used ping`);
      output.edit(
        `Pong! Latency is ${output.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`
      );
      break;
    default:
      output.edit("That's not a command!")
  }
});
client.login(process.env.DISCORD_TOKEN);
