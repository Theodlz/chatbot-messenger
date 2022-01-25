'use strict';
const axios = require("axios");
const apikey = 'cX2piU5AUbrMO5kGmCg8vgve4kvvOS8r';

const getWeather = (location, time) => {

    return new Promise(async (resolve, reject) => {
        try{

            const locationData = await axios.get(
                'http://dataservice.accuweather.com/locations/v1/cities/search',
                {params: {
                    apikey: apikey,
                    q: location
                    
                }
            });
            
            if(time=='now'){

                const weatherConditions = await axios.get(
                    `http://dataservice.accuweather.com/currentconditions/v1/${locationData.data[0]['Key']}`,
                    {params: {
                        q: locationData.data[0]['Key'],
                        metric: true,
                        apikey: apikey
                    }
                });
                resolve(weatherConditions.data)
            }
            if(time=='today') {
                const weatherConditions = await axios.get(
                    `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationData.data[0]['Key']}`,
                    {params: {
                        apikey: apikey,
                        metric: true
                    }
                });
                resolve(weatherConditions.data)
            }
            if(time=='tomorrow') {
                const weatherConditions = await axios.get(
                    `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationData.data[0]['Key']}`,
                    {params: {
                        apikey: apikey,
                        metric: true
                    }
                });
                resolve(weatherConditions.data)
            }
            
        }
        catch(error){
            reject(error);
        }
    });

};

module.exports = getWeather;


