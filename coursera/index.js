'use strict';

const fs = require('fs');

const {recommendFromCourseAndUser} = require('./coursera_recommender.js');
const users = JSON.parse(fs.readFileSync('./coursera/data/users.json'));
const courses = JSON.parse(fs.readFileSync('./coursera/data/courses.json'));

const extractEntity = (nlp, entity) => {
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
        if(nlp.entities[entity] && nlp.entities[entity][0].confidence>=0.8){
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
          if(intent === 'recommendationFromCourseAndUser') {
            let courseName = extractEntity(nlpData, 'course:course');
            console.log(courseName);
    
            try {
              let result = await recommendFromCourseAndUser(userID, courseName, 5, courses, users);
              console.log(result);
              if(result.status === 200) {
                  // fill an array with the courses
                    let response = [
                        {type : 'text', content : 'Here are the courses you might like:'},
                    ];
                    for(let i = 0; i < result.recommendations.length; i++) {
                        response.push({type : 'text', content : result.recommendations[i]});
                    }
                    resolve(response);
                } else {
                    resolve([{type : 'text', content : "Sorry, I couldn't find the course you are looking for in Coursera, please try again."}]);
                }           
            } catch(e) {
                console.log(e);
                resolve([{type : 'text', content : "Sorry, I couldn't find the course you are looking for in Coursera, please try again."}]);
            }
          } else {
            resolve([{type : 'text', content : "Sorry, I don't understand your request, please try again(Not Implemented yet)."}]);
          }
        }
    });
};