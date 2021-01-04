const http = require("http");
const fs = require("fs");
const discord = require("discord.js");
const client = new discord.Client();
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

const error1 = setTimeout(function() {
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
  if (!messageLower.includes("k?")) return;
  //COMMANDS!!!!!!
  switch (command) {
    case "ping":
      const hello = await message.channel.send("Ping?");
      console.log(`${message.author.username} used ping`);
      hello.edit(
        `Pong! Latency is ${hello.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`
      );
      break;
    case "changegame":
      var text = message.content.substr("k?changegame ".length);
      fs.writeFile("views/game.txt", text, err => {
        if (err) throw err;
      });
      client.user.setActivity(text);
      message.channel.send(`changed bot's activity to: ${text}`);
          console.log(`${message.author.username} changed game to ${text}`);
      return;
      break;
    default:
      message.reply("That's not a command!");
  }
});
client.login();