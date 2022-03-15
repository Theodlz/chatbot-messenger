'use strict';

const fs = require('fs');

const {recommendFromCourse, recommendFromUser, resetUser } = require('./coursera_recommender.js');
const users = JSON.parse(fs.readFileSync('./coursera/data/users.json'));
const courses = JSON.parse(fs.readFileSync('./coursera/data/courses.json'));

const extractEntity = (nlp, entity) => {
  console.log(nlp);
    try {
        if (entity === 'intent') {
          if (nlp.intents[0]['confidence']>=0.6){
              return nlp.intents[0]['name'];
          }
          else {
              return null;
          }
        }
        else {
          if(nlp.entities[entity] && nlp.entities[entity][0].confidence>=0.7){
              return nlp.entities[entity][0].value;
          } else {
              return null;
          }
        }
    } catch(e) {
        console.log(e);
        return 'error';
    }
    
};
module.exports = (userID, nlpData) => {
    return new Promise(async function(resolve, reject) {
        let intent = extractEntity(nlpData, 'intent');
        if(intent) {
          console.log(intent);
          if(intent === 'recommendationFromCourse') {
            let courseName = extractEntity(nlpData, 'course:course');
            console.log(courseName);
    
            try {
              let result = await recommendFromCourse(userID, courseName, 5, courses, users);
              console.log(result);
              if(result.status === 200) {
                  // fill an array with the courses
                    let response = [
                        {type : 'text', content : 'Here are the courses you might like:'},
                    ];
                    for(let i = 0; i < result.recommendations.length; i++) {
                        response.push({type : 'web_url', title : result.recommendations[i].name, url: result.recommendations[i].url, image_url: result.recommendations[i].image_url});
                    }
                    resolve(response);
                } else {
                    resolve([{type : 'text', content : "Sorry, I couldn't find the course you are looking for in Coursera, please try again."}]);
                }           
            } catch(e) {
                console.log(e);
                resolve([{type : 'text', content : "Sorry, I couldn't find the course you are looking for in Coursera, please try again."}]);
            }
          } else if (intent === 'recommendationFromUser') {
            try {
              let result = await recommendFromUser(userID, 5, courses, users);
              console.log(result);
              if(result.status === 200) {
                  // fill an array with the courses
                    let response = [
                        {type : 'text', content : 'Here are the courses you might like based on your profile:'},
                    ];
                    for(let i = 0; i < result.recommendations.length; i++) {
                        response.push({type : 'web_url', title : result.recommendations[i].name, url: result.recommendations[i].url, image_url: result.recommendations[i].image_url });
                    }
                    resolve(response);
                } else if (result.status === 400){
                    resolve([{type : 'text', content : result.message}]);
                } else {
                    resolve([{type : 'text', content : "Sorry, it seems that we are having issues at the moment, please try again later."}]);
                }
              
            } catch(e) {
                console.log(e);
                resolve([{type : 'text', content : "Sorry, it seems that we are having issues at the moment, please try again later."}]);
            }
          } else if (intent === 'help') {
            resolve([{type : 'text', content : "Welcome (back) !"},
                     {type : 'text', content : "Here's how to use me:"},
                     {type : 'text', content : "1. IF you are using me for the first time, start by giving me the name of a course you liked on coursera !"},
                     {type : 'text', content : 'Example: "I liked Fundamentals of Reinforcement Learning, can you give me any recommendations ?" '},
                     {type : 'text', content : '2. IF you used me before, you can ask the same question as above, which will recommend you 5 courses similar to this one, and add it to your profile.'},
                     {type : 'text', content : '3. ALSO, you can ask: "Can you recommend me new courses ?", which will give your 5 recommendations of courses to attend to, based on your user profile.'},
                     {type : 'text', content : '4. FINALLY, you can ask: "Reset my user profile please", which will reset your history of courses in your profile. You can use this if the recommendations we give you do not correspond to your interests anymore'},
                     {type : 'text', content : "Have fun learning new things on Coursera !!! IF you need help again, just ask !"},
                    ]);
          } else if(intent==='resetUser') {
            await resetUser(userID, users);
            resolve([{type : 'text', content : "Your courses history has been emptied. Have fun giving us new ones, we hope we can give you even better recommendations this time!"}]);
          } else {
            resolve([{type : 'text', content : "Sorry, I don't understand your request, please try again(Not Implemented yet)."}]);
          }
        }
    });
};