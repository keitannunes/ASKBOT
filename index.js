/*
AS3K BOT v0.X
Developed by Keitan Nunes

aaaaaaaaaaaaaaaaaaaaaaa
*/

//declaring objects
const http = require("http");
const fs = require("fs");
const discord = require("discord.js");
const client = new discord.Client();
const path = require('path');
const redditApiImageGetter = require('reddit-api-image-getter')
const getter = new redditApiImageGetter();
const axios = require("axios");
const { isEmptyObject } = require("jquery");
require('dotenv').config();

//stuff
awwDownloaded = false;
memeDownloaded = false;
const noneResponse = [
  "Sorry, I didn't get that",
  "Sorry, can you repeat that?",
  "Sorry, I didn't quite understand. Can you repeat that?",
  "Sorry, I didn't get that. Hint: ask me what I can do to get our full feature list!",
  "Sorry, I didn't get that. If you feel like something is wrong, contact my developer at keifun#9588"
]
//Functions
async function luisPrediction(query) {
  const response = await axios.get(process.env.AZURE_URL + query)
  return response.data.prediction;
}

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
client.channels.cache.get()
console.clear()
console.log("Loading... Please wait");
console.log("creating Web server")
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
});
server.listen(3000);

//Timeout error
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

//runs when bot gets message
client.on("message", async message => {
  const args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/g);

  const command = args.shift().toLowerCase();
  if (message.author.bot) return; //ignores messages from bots
  if (!message.member.roles.cache.has('837731710468751400')) {//ignores messages from uesrs without role
    message.reply("You are missing perms...");
    return;
  }
  if (message.content.indexOf(process.env.PREFIX) !== 0) return; // ignores messages without prefix in .env file
  output = await message.channel.send("Thinking..."); //Response that we are gonna edit

  //Commands
  switch (command) {

    case "ping":
      console.log(`${message.author.username} used ping`);
      output.edit(`Pong! Latency is ${output.createdTimestamp - message.createdTimestamp}ms.`);
      break;
    /*
        case "ask":
          output.edit("Hey! It's Askbot! How may I help you?")
          var userReplied = false
          const filter = (m) => { //define filter 
            return m.author.id === message.author.id
          };
    
            const collector = message.channel.createMessageCollector(filter, { time: 30000, max: 1 }); // declare collector with max wait time 15 sec and 1 reply
    
            collector.on('collect', m => {//runs when collected something
              
              luisPrediction(m.content).then((intent) => {
                if (intent === "sendImage") {
                  message.reply("I will send an image")
                }else{
                 console.log(intent)
                }
                userReplied = true;
              });
            });
    
            collector.on('end', collected => { //runs when collector stops collecting
              console.log(`Collected ${collected.size} items`);
              if (!userReplied) { //checks if man dont respond
                message.channel.send("Are you still here?")
              }
            });
          break;
    */
    case "askbot":
      luisResponse = await luisPrediction(message.content.slice(8))
      console.log("Top Intent: " + luisResponse.topIntent);
      console.log("Entities:" + luisResponse.entities)


      switch (luisResponse.topIntent) {
        case "sendImage":
          //Animal Image
          if (isEmpty(luisResponse.entities)) {//when there are no entities
            output.edit(noneResponse[Math.floor(Math.random() * noneResponse.length)]);
            return;
          }
          if (luisResponse.entities.imageType[0].hasOwnProperty('aww')) {
            if (!awwDownloaded) {
              //gets new hot images from r/aww and puts it in /images/hot/aww
              getter.getHotImagesOfSubReddit('aww').then(function (result) {
                for (imageEntry of result) {
                  const targetDirectory = path.resolve(__dirname, 'images', 'hot');
                  getter.saveRedditImageEntryToDisk(imageEntry, targetDirectory);//saves to the folder
                }
              })
              //r/eyebleach
              getter.getHotImagesOfSubReddit('eyebleach').then(function (result) {
                for (imageEntry of result) {
                  const targetDirectory = path.resolve(__dirname, 'images', 'hot');
                  getter.saveRedditImageEntryToDisk(imageEntry, targetDirectory);//saves to the folder
                }
              })
              awwDownloaded = true;
            }
            //chooses random file from dir and replies to user
            var files = fs.readdirSync(__dirname + '/images/hot/aww/')
            chosenFile = files[Math.floor(Math.random() * files.length)]
            message.reply("Here is an image from r/aww", { files: ['images/hot/aww/' + chosenFile] })//returns file
            output.delete() //delete thinking.. message
          }
          else if (luisResponse.entities.imageType[0].hasOwnProperty('meme')) {
            if (!memeDownloaded) {
              //gets new hot images from r/wholesomememes and puts it in /images/hot/wholesomememes
              getter.getHotImagesOfSubReddit('wholesomememes').then(function (result) {
                for (imageEntry of result) {
                  const targetDirectory = path.resolve(__dirname, 'images', 'hot');
                  getter.saveRedditImageEntryToDisk(imageEntry, targetDirectory);//saves to the folder
                }
              });
              memeDownloaded = true;
            }
            //chooses random file from dir and replies to user
            var files = fs.readdirSync(__dirname + '/images/hot/wholesomememes/')
            chosenFile = files[Math.floor(Math.random() * files.length)]
            message.reply("Here is an image from r/wholesomememes", { files: ['images/hot/wholesomememes/' + chosenFile] })//sends file
            output.delete()//delets the thinking... message

          }
          break;
        case "featurelist":
          output.edit("Our full feature list can be found here:")

          break;

        case "None"://when luis doesn't think when its any of my other intents
          output.edit(noneResponse[Math.floor(Math.random() * noneResponse.length)])//randomly chooses one of the random none responses
      } // end switch
      break;

    /*
        case "aww":
          //gets new hot images from r/aww and puts it in /images/hot/aww
          getter.getHotImagesOfSubReddit('aww').then(function (result) {
            for (imageEntry of result) {
              const targetDirectory = path.resolve(__dirname, 'images', 'hot');
              getter.saveRedditImageEntryToDisk(imageEntry, targetDirectory);//saves to the folder
            }
          })
          //r/eyebleach
          getter.getHotImagesOfSubReddit('eyebleach').then(function (result) {
            for (imageEntry of result) {
              const targetDirectory = path.resolve(__dirname, 'images', 'hot');
              getter.saveRedditImageEntryToDisk(imageEntry, targetDirectory);//saves to the folder
            }
          })
          //chooses random file from dir and replies to user
          var files = fs.readdirSync(__dirname + '/images/hot/aww/')
          chosenFile = files[Math.floor(Math.random() * files.length)]
          message.reply("Here is an image from r/aww", { files: ['images/hot/aww/' + chosenFile] })//sends file
          output.delete()//delets the thinking... message
          break;
    
        case "wholesomememes":
          //gets new hot images from r/wholesomememes and puts it in /images/hot/wholesomememes
          getter.getHotImagesOfSubReddit('wholesomememes').then(function (result) {
            for (imageEntry of result) {
              const targetDirectory = path.resolve(__dirname, 'images', 'hot');
              getter.saveRedditImageEntryToDisk(imageEntry, targetDirectory);//saves to the folder
            }
          });
    
          //chooses random file from dir and replies to user
          var files = fs.readdirSync(__dirname + '/images/hot/wholesomememes/')
          chosenFile = files[Math.floor(Math.random() * files.length)]
          message.reply("Here is an image from r/wholesomememes", { files: ['images/hot/wholesomememes/' + chosenFile] })//sends file
          output.delete()//delets the thinking... message
          break;
    
        case "quote":
          axios.get('https://zenquotes.io/api/random').then(function (response) {
            output.edit(response.data[0].q)
          })
            .catch(function (error) {
              console.log(error);
              output.edit(error)
            })
          break;
        case "affirmation":
          axios.get('https://www.affirmations.dev').then(function (response) {
            output.edit(response.data.affirmation)
          }).catch(function (error) {
            console.log(error);
          })
          break;
          */
    default: //when command doens't match any cases
      output.edit("That's not a command!")
  }
});
client.login(process.env.DISCORD_TOKEN);
