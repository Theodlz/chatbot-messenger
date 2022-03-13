'use strict';
// use coursera's api using fetch to get the data of all courses
// and scrape the ratings of each course
// and save it to a json file
//import node-fetch
const fetch = import('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const courseTags = require('./coursera_processing.js');

//function to get the data of a course using the course's name
async function getCourseData(courseName) {
    const query = courseName.toLowerCase().split(' ').join('+');
    const url = `https://api.coursera.org/api/courses.v1?q=search&query=${query}&fields=domainTypes,description,primaryLanguages,photoUrl,instructorIds`;
    let response = await fetch(url);
    if (response.status !== 200) {
        console.log(`Error: ${response.status}`);
        return null;
    } else {
        let data = await response.json();
        data = data.elements;
        // check if the course exists in the data
        if (data.length === 0) {
            console.log(`Error: course ${courseName} does not exist`);
            return null;
        } else {
            data =  data[0];
            if(data.primaryLanguages.includes('en')) {
                let themes = [];
                for (let j = 0; j < data.domainTypes.length; j++) {
                    themes.push(data.domainTypes[j].domainId);
                    themes.push(data.domainTypes[j].subdomainId);
                }
                data.themes = Array.from(new Set(themes)).join(',');
                data.primaryLanguages = data.primaryLanguages.join(',');
                data.instructorIds = data.instructorIds.join(',');
                delete data.domainTypes;
                delete data.courseType;
                delete data.id;
                data.url = `https://www.coursera.org/learn/${data.slug}`
                const rating = await scrapeCourse(data);
                console.log(rating);
                if (rating !== null) {
                    data.rating = rating;
                    data.tags = courseTags(data);
                    delete data.slug;
                    return await reorderCourse(data);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
        
    }
}

// function to scrape the rating of one course, takes the course as an input and returns the rating
async function scrapeCourse(course) {
    let response = await fetch(course.url);
    let data = await response.text();
    let $ = cheerio.load(data);
    let rating = await $('.rating-text').text();
    return parseFloat(rating.replace('stars', ''));
}

// function to reorder courses object in the following order: name, description, themes, rating
async function reorderCourse(course) {
    const courseOrder = {
        name: null,
        description: null,
        themes: null,
        rating: null,
        primaryLanguages: null,
        instructorIds: null,
        url: null,
        photoUrl: null
    }

    course = Object.assign(courseOrder, course);
    return course;
}

function saveData(data) {
    // create a json file
    // write the data to the json file
    fs.writeFile('./data/courses.json', JSON.stringify(data, null, 2), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

async function addUpdateCourse(courseName, courses) {
    const course = await getCourseData(courseName);
    if (course !== null) {
        // check if the course already exists in courses
        let index = -1;
        let exists = false;
        for (let i = 0; i < courses.length; i++) {
            if (courses[i].name === course.name) {
                index = i;
                exists = true;
            }
        }
        if (!exists) {
            courses.push(course);
            saveData(courses);
            return {"status":200, "message":'Successfully added ' + courseName + ' to the database'};
        } else {
            //update the rating of the course
            courses[index].rating = course.rating;
            console.log('Course already exists in the database');
            return {"status":200, "message":'Course already exists in the database, rating updated'};
        }
        
    } else {
        return {"status":404, "message":'Course not found, or rating not found'};
    }

}

module.exports = {
    addUpdateCourse
};
