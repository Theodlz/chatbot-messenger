'use strict';
const crypto = require('crypto');
const request = require('request');
const apiVersion = 'v12.0';

class FBeamer{

    constructor({pageAccessToken, VerifyToken, appSecret}){
        try {
            this.pageAccessToken = pageAccessToken;
            this.VerifyToken = VerifyToken;
            this.appSecret = appSecret;
        }

        catch(error) {
            reject(error);
        }
    }

    registerHook(req, res) {
        const params = req.query;
        
        const mode = params['hub.mode'];
        let token = params['hub.verify_token'];
        let challenge = params['hub.challenge'];
        try {
            if(mode === 'subscribe' && token === this.VerifyToken){
                console.log('webhook is registered')
                return res.send(challenge);
            } else {
                console.log('Could not register webhook');
                return res.sendStatus(200);
            }
        }

        catch(error) {
            console.log(error);
        } 
    }

    verifySignature(req, res, buf) {
      return (req, res, buf) => {
        if(req.method === 'POST') {
          try {
            const x_hub_signature = req.headers['x-hub-signature'];
            let temp_hash = crypto.createHmac('sha1', this.appSecret).update(buf, 'utf-8');
            let hash = temp_hash.digest('hex');
            if(x_hub_signature === 'sha1='+hash){
              console.log('signature is verified');
              return true;
            }
            else {
              console.log('signature is NOT verified');
              return false;
            }

          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    messageHandler(obj){
      let sender = obj.sender.id;
      let message = obj.message;
      console.log(message.nlp);
      if(message.text){
        let obj = {
          sender,
          type: 'text',
          content: message.text
        }
        return obj;
      }
      /*
      if(message.attachments[0].type === 'image'){
        let obj = {
          sender,
          type: 'image',
          content: message.attachments[0].payload
        }
        return obj;
      }
      */
    }

    

    incoming(req, res, cb) {
      res.sendStatus(200);
      if(req.body.object === 'page' && req.body.entry) {
        let data = req.body;
        for(let i=0; i< data.entry.length; i++) {
          let entry = data.entry[i];
          for(let j=0; j< entry.messaging.length; j++){
            let messageObj = entry.messaging[j];
            if(messageObj.postback){
              //handle postbacks
            }
            else{
              //handle messages
              return cb(messageObj);
            }
          };
        }; 
      }
    }

    sendMessage(payload){
      return new Promise((resolve, reject) =>  {
        request({
          uri: `https://graph.facebook.com/${apiVersion}/me/messages`,
          qs:{
            access_token: this.pageAccessToken
          },
          method: 'POST',
          json: payload
        }, (error, response, body) => {
          if(!error && response.statusCode === 200) {
            resolve({
              mid: body.message_id
            });
          } else {
            reject(error);
          }
        });
      });
    }

    txt(id, text, messaging_type = 'RESPONSE'){
      
      let obj = {
        messaging_type,
        recipient:{
          id
        },
        message: {
          text
        }
      }
      return this.sendMessage(obj);
    }

    img(id, image_url, messaging_type='RESPONSE'){
      let obj = {
        messaging_type,
        recipient:{
          id
        },
        message: {
          attachment: {
            type: 'image',
            payload: {
              url: image_url,
              is_reusable:true
            }
          }
        }
      }
      return this.sendMessage(obj);
    }
}

module.exports = FBeamer;