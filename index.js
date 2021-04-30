const http = require("http");
const fs = require("fs");
const discord = require("discord.js");
const client = new discord.Client();
const path = require('path');
const axios = require('axios');
const redditApiImageGetter = require('reddit-api-image-getter')
const getter = new redditApiImageGetter()

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
  if (message.author.bot) return; //ignores messages from bots
  if (!message.member.roles.cache.has('837731710468751400')) return; //ignores messages from uesrs without role
  if (message.content.indexOf(process.env.PREFIX) !== 0) return; //ignores messages without prefix in .env file
  const output = await message.channel.send("Thinking..."); //Response that we are gonna edit
  
  //COMMANDS!!!!!!
  switch (command) {
    case "ping":
      console.log(`${message.author.username} used ping`);
      output.edit(`Pong! Latency is ${output.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
      break;
    case "ask":
      output.edit('Are you ok?')
      var userReplied = false
      const filter = (m) => { //define filter (i actually dont know what this does)
        return m.author.id === message.author.id
      };

      const collector = message.channel.createMessageCollector(filter, { time: 15000, max: 1 }); // declare collector with max wait time 15 sec and 1 reply

      collector.on('collect', m => {//runs when collected something
        console.log(`Collected ${m.content}`);
        userReplied = true;
      });

      collector.on('end', collected => { //runs when collector stops collecting
        console.log(`Collected ${collected.size} items`);
        if (!userReplied) { //checks if man dont respond
          message.channel.send("Are you still here?")
        }
      });
      break;

    case "aww":
      //gets new hot images from r/aww and puts it in /images/hot/aww
      getter.getHotImagesOfSubReddit('aww').then(function (result) {
        for (imageEntry of result) {
          const targetDirectory = path.resolve(__dirname, 'images', 'hot');
          getter.saveRedditImageEntryToDisk(imageEntry, targetDirectory);//saves to the folder
        }
      })

      //chooses random file from dir and replies to user
      var files = fs.readdirSync(__dirname + '/images/hot/aww/')
      chosenFile = files[Math.floor(Math.random() * files.length)]
      output.delete()//delets the thinking... message
      message.reply("Here is an image from r/aww", { files: ['images/hot/aww/' + chosenFile] })//sends file
      break;

    default://when command doens't match any cases
      output.edit("That's not a command!")
  }
});
client.login(process.env.DISCORD_TOKEN);
