'use strict';
const axios = require("axios");
const { TMBD } = require('../config');

const getMovieData = (movie, releaseYear = null) => {
  return new Promise((resolve, reject) => {
    try {
      const movieData = axios.get(
                'https://api.themoviedb.org/3/search/movie',
                {params: {
                    api_key: TMBD,
                    query: movie,
                    year: releaseYear                 
                }
            });
      
      resolve(movieData);
      
    } catch(e) {
      console.log(e)
      resolve(null);
    }
  })
}

const getDirector = (movieid) => {
  return new Promise((resolve, reject) => {
    try {
      const movieCredits = axios.get(
                `https://api.themoviedb.org/3/movie/${movieid}/credits`,
                {params: {
                    api_key: TMBD            
                }
            });
      
      resolve(movieCredits);
      
    } catch(e) {
      console.log(e)
      resolve(null);
    }
  })
}

const extractEntity = (nlp, entity) => {
  try {
    if (entity === 'intent') {
      try {
        if (nlp.intents[0]['confidence']>=0.6){
          return nlp.intents[0]['name'];
        }
        else {
          return null;
        }
       } catch(e) {
          console.log(e);
          return 'error';
         }
    }
    else {
      try {
        if(nlp.entities[entity] && nlp.entities[entity][0].confidence>=0.8){
        return nlp.entities[entity][0].value;
      } else {
        return null;
      }
      } catch (e) {
        console.log(e);
        return 'error';
      }
    }
  } catch(e) {
    console.log(e);
    return 'error';
  }
  
}

module.exports = nlpData => {
  return new Promise(async function(resolve, reject) {
    let intent = extractEntity(nlpData, 'intent');
    if(intent) {
      if(intent === 'movieinfo') {
        let movie = extractEntity(nlpData, 'movie:movie');
        console.log(movie);
        
        let releaseYear = extractEntity(nlpData, 'releaseYear:releaseYear');
        console.log(releaseYear);

        try {
          let movieData = await getMovieData(movie, releaseYear);
          movieData = movieData.data.results[0]
          let response = [
            {type : 'image', content: 'https://image.tmdb.org/t/p/w500'+movieData.poster_path},
            {type : 'text', content: movieData.title + ', released on the '+movieData.release_date},
            {type : 'text', content: "Overview: "+movieData.overview}
            ]
          resolve(response);
        } catch(error) {
          reject(error);
        }
      }
      if(intent === 'director') {
        let movie = extractEntity(nlpData, 'movie:movie');
        console.log(movie);

        try {
          let movieData = await getMovieData(movie);
          movieData = movieData.data.results[0]
          let directorData = await getDirector(movieData.id);
          directorData = directorData.data.crew.filter(({job}) => job === 'Director')[0];
          let response = [
            {type : 'image', content: 'https://image.tmdb.org/t/p/w500'+directorData.profile_path},
            {type : 'text', content: movieData.title+' was directed by: '+ directorData.name},
            ]
          resolve(response);
        } catch(error) {
          reject(error);
        }
      }

      if(intent === 'releaseYear') {
        let movie = extractEntity(nlpData, 'movie:movie');
        console.log(movie);

        try {
          let movieData = await getMovieData(movie);
          movieData = movieData.data.results[0]
          let response = [
            {type : 'image', content: 'https://image.tmdb.org/t/p/w500'+movieData.poster_path},
            {type : 'text', content: movieData.title + ' was released on the '+movieData.release_date},
            ]
          resolve(response);
        } catch(error) {
          reject(error);
        }
      }
     if(intent == 'error') {
       resolve([{
        type: 'text',
        content: "Oups!  We are facing issues and are fixing it. Please come back later !!"
      }]);
     }
      
    } else {
      resolve([{
        type: 'text',
        content: "I'm not sure I understand you!"
      }]);
    }

  });
}
