

// import data from data/courses.json using fs
const fs = require('fs');

const {addUpdateCourse} = require('./coursera_api.js');

// function to save user to users.json
async function saveUsers(users) {
    //if file doesn't exist, create it
    if (!fs.existsSync('./data/users.json')) {
        //create empty file
        fs.writeFileSync('./data/users.json', '[]');
    }
    fs.writeFileSync('./data/users.json', JSON.stringify(users, '', 2));
}


// function to add a user to the users array if it doesn't exist, taking an id and a list of courses as parameters
// if the user already exists, add the courses to the user's list of courses
async function addUpdateUser(id, courses, users) {
    var user = users.find(function(user) {
        return user.id === id;
    });
    if (user) {
        user.courses = Array.from(new Set(user.courses.concat(courses)));
    } else {
        user = {
            "id": id,
            "courses": courses
        };
        users.push(user);
    }
    saveUsers(users);
    return user;
}
    
// function to check if a course is in courses array using its name
function courseExists(courseName, courses) {
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].name === courseName) {
            return true;
        }
    }
    return false;
}

async function getCourse(courseName, courses) {
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].name === courseName) {
            return courses[i];
        }
    }
    return null;
}

function cosineSimilarity(str1, str2) {
    let str1Arr = str1.split(' ');
    let str2Arr = str2.split(' ');
    let intersection = str1Arr.filter(x => str2Arr.includes(x));
    let union = str1Arr.concat(str2Arr);
    let unionSet = new Set(union);
    let intersectionSet = new Set(intersection);
    let unionLength = unionSet.size;
    let intersectionLength = intersectionSet.size;
    let cosineSimilarity = (intersectionLength / unionLength);
    return cosineSimilarity;
}

function findSimilarCourses(courseList, courses, n) {
    let similarities = [];
    courseList.forEach(course => {
        let courseIndex = courses.findIndex(c => c.name === course);
        let similarity = new Array(courses.length);
        for (let i = 0; i < courses.length; i++) {
            
            similarity[i] = cosineSimilarity(courses[i].tags, courses[courseIndex].tags);
        }
        if(similarities.length == 0){
            similarities = similarity
        } else {
            // add values of similarity to similarities 
            for (let i=0; i<similarity.length; i++) {
                similarities[i] += similarity[i];
            }
        }
    });
    let indices = similarities.map((e, i) => {
        return {
            index: i,
            value: e
        };
    }).sort((a, b) => {
        return b.value - a.value;
    }).slice(courseList.length, n+courseList.length).map(e => e.index);
    let names = indices.map(i => courses[i].name);
    return names;
}

async function recommendFromCourseAndUser(id, courseName, n, courses, users) {
    // check if course exists in courses array
    // if not, get the data from coursera api
    // add the course to courses array
    // add the user to users array
    // save the users array to users.json
    // find similar courses
    // return the similar courses
    if (!courseExists(courseName, courses)) {
        let newCourse = await addUpdateCourse(courseName, courses);
        if (newCourse.status == 200) {
            // get the course from the courses array using the course name
            // update user's list of courses
            let user = await addUpdateUser(id, [courseName], users);
            // find similar courses
            let recommandations = await findSimilarCourses(user.courses, courses, n);
            return {"status": 200, "message": "Course added and recommandation's given", "recommandation": recommandations};

        } else {
            return newCourse;
        }
    } else {
        // update user's list of courses
        let user = await addUpdateUser(id, [courseName], users);
        // find similar courses
        let recommandations = await findSimilarCourses(user.courses, courses, n);
        return {"status": 200, "message": "Course added and recommandations given", "recommandations": recommandations};
    }

}

// export the function recommend
module.exports = {
    recommendFromCourseAndUser
};