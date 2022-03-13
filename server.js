'use strict';

const express = require('express');
const bodyparser = require('body-parser');
const { FB, witToken } = require('./config');
const server = express();
const PORT = process.env.PORT || 3000;

const FBeamer = require('./fbeamer');

const coursera = require("./coursera");


const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: witToken});



const f = new FBeamer(FB);
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
      let courseraData = await coursera(data.sender, nlp);
      for (let i=0; i< courseraData.length; i++) {
        if(courseraData[i].type === 'text') {
          await f.txt(data.sender, courseraData[i].content);
        }
        if(courseraData[i].type === 'image') {
          await f.img(data.sender, courseraData[i].content);
        }
      } 
      
    }
    catch(e){
      console.log(e)
    }
  });
  });

