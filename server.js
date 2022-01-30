'use strict';

const express = require('express');
const bodyparser = require('body-parser');
const { FB } = require('./config');
const server = express();
const PORT = process.env.PORT || 3000;

const config = require('./config');
const FBeamer = require('./fbeamer');

const matcher = require('./matcher');
const weather = require("./weather");

const img_test_url = 'https://www.free-press.it/wp-content/uploads/2021/02/Ora-puoi-Rickroll-persone-in-4K.jpg';

const f = new FBeamer(config.FB);
server.post('/fb', bodyparser.json({
  verify: f.verifySignature.call(f)
  }));


server.get('/fb', (req, res) => f.registerHook(req, res));
server.listen(PORT, () => console.log(`The bot server is running on port ${PORT}`));

server.post('/fb', (req, res, next) => {
  return f.incoming(req, res, async data => {
    data = f.messageHandler(data);
    try{
      console.log(data.content);
      /*
      if (data.content == 'hello world'){
        console.log('sending...');
        await f.txt(data.sender, 'hey i received your message in my chatbot :)))');
      }
      if (data.content == 'send me an image'){
        console.log('sending...');
        await f.img(data.sender, img_test_url);
      }

      */
      matcher(data.content, cb => {
        console.log(cb);
        switch(cb.intent){
            case 'Hello':
                f.txt(data.sender, 'Hello ! What do you want to know ?');
                break;
            case 'Exit':
                f.txt(data.sender, 'See you next time !');
                break;
            case 'get current weather':
                weather(cb.entities.city, 'now').then((result) => {
                    f.txt(data.sender, `Here is the weather in ${cb.entities.city} right now:`);
                    f.txt(data.sender, `Temperature: ${result[0]['Temperature']['Metric']['Value']} C`);
                    f.txt(data.sender, `Weather: ${result[0]['WeatherText']}`);
                });
                break;
            case 'get weather':
                weather(cb.entities.city, cb.entities.time).then((result) => {
                    if(cb.entities.time=='today'){
                        f.txt(data.sender, `Here is the weather today in ${cb.entities.city}:`);
                        f.txt(data.sender, `Minimum: ${result['DailyForecasts'][0]['Temperature']['Minimum']['Value']} C`);
                        f.txt(data.sender, `Maximum: ${result['DailyForecasts'][0]['Temperature']['Maximum']['Value']} C`);
                        f.txt(data.sender, `Weather: ${result['DailyForecasts'][0]['Day']['IconPhrase']}`);
                    }
                    if(cb.entities.time=='tomorrow'){
                        f.txt(data.sender, `Here is the weather tomorrow in ${cb.entities.city}:`);
                        f.txt(data.sender, `Minimum: ${result['DailyForecasts'][1]['Temperature']['Minimum']['Value']} C`);
                        f.txt(data.sender, `Maximum: ${result['DailyForecasts'][1]['Temperature']['Maximum']['Value']} C`);
                        f.txt(data.sender, `Weather: ${result['DailyForecasts'][1]['Day']['IconPhrase']}`);
                    }
                
                });
                break;
            default:
                f.txt(data.sender, `Sorry I don't understand what you said. Try again !`);
                break;
        }
    });
    }
    catch(e){
      console.log(e)
    }
  });
  });

