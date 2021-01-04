const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");
document.write(client.users.size)

const express = require('express')
const app = express()


client.login(config.token);