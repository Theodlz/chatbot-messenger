'use strict';

const express = require('express');
const bodyparser = require('body-parser');
const { FB, witToken } = require('./config');
const server = express();
const PORT = process.env.PORT || 3000;

const FBeamer = require('./fbeamer');

const matcher = require('./matcher');
const weather = require("./weather");
const tmdb = require("./tmdb");

const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: witToken});



const f = new FBeamer(config.FB);
server.post('/fb', bodyparser.json({
  verify: f.verifySignature.call(f)
  }));


server.get('/fb', (req, res) => f.registerHook(req, res));
server.listen(PORT, () => console.log(`The bot server is running on port ${PORT}`));

server.post('/fb', (req, res, next) => {
  return f.incoming(req, res, async data => {
    let nlp = await client.message(data.message.text);
    data = f.messageHandler(data);
    try{
      let tmdbData = await tmdb(nlp);
      for (let i=0; i< tmdbData.length; i++) {
        if(tmdbData[i].type === 'text') {
          await f.txt(data.sender, tmdbData[i].content);
        }
        if(tmdbData[i].type === 'image') {
          await f.img(data.sender, tmdbData[i].content);
        }
      } 
      
    }
    catch(e){
      console.log(e)
    }
  });
  });

