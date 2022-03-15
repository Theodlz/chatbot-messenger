# ProjectName TeamName - DIA2

## Members
- Theophile JEGOU DU LAZ

## Description
The goal of the project is to develop a messenger bot, that can recommend you new courses (from Coursera) to attend to. By chatting with the bot and telling him about the courses you like, it will be able to make recommendations based on your profile. Also, you can ask the bot to give you new courses to attend to, that are similar to a specific course you liked. Of course, you can ask for help. And as it is history based and the interests of a user can change with time, you can ask the bot to reset your user history.

## Bot Info
- Chatbot platform: Facebook (Messenger)
- [Chat with bot](https://m.me/105527265428359) (open on new tab)
- [Working video of this bot](https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)

## Recommender System
For the recommender system, we used Content-based Filtering. Basically, in your dataset, we have the Name of the Course, a description, and subjects/themes that it belongs to. We used all of those to create "tags", that are a list of the most important/relevant words in the course's data. Then, when we want to get the n most similar courses to a given course, we compute the cosine similarity between all the courses of the dataset and this course using the "tags". The formula to calculate the cosine similarity between two strings (aka Word vectors) is the following:

 CosineSimilarity = Intersection of both strings / Union of both strings

PS: For both strings, we only use each word one time (We split the string to get a vector of its words, and we transform it into a set and back to an array to have a unique word vector).

### Used Api and dataset
For the dataset, we did not use a publicly available dataset from Kaggle, but we made our own dataset using [Coursera's catalog API](https://build.coursera.org/app-platform/catalog). Also, even if we did not use it in our recommender system, we enriched the data provided by the API by scraping the ratings of every course on their respective webpage. We also made sure that when a user gives the bot a course that is not present in our database, we do not just skip its request, but verify if that course is available on Coursera. If it is, we scrape its data and add it to your DB.

#### [Wit.ai](https://wit.ai/)
We used it for the language processing, which we'll talk about in the next paragraph.

## Language Processing
For the language processing, we used an external service called [Wit.ai](https://wit.ai/). It is an AI service that learns how to extract intents, entities and values of your choice from utterances (sentences). We trained it on a certain number of example sentences that a user of the bot could use.


Here is a video of what contains our Wit.ai app: [Video](https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)



### Intents and Entities
Please describe your chatbot intents and entities.
Each intent should be in the new line:
e.g.:

| Intent         | Entities               |
|----------------|------------------------|
| recommendFromCourse    | course  |
| recommendFromUser | |
| resetUser    |  |
| help    |  |


## Scenarios

### Greetings / Asking for help:
| User | Bot                                                     |
|------|---------------------------------------------------------|
| Hi / Hello / Help   | Welcome (back) !                                  |
|      | Here's how to use me: |
|      | 1. IF you are using me for the first time, start by giving me the name of a course you liked on coursera !                    |
| |Example: "I liked Fundamentals of Reinforcement Learning, can you give me any recommendations ?"|
| |2. IF you used me before, you can ask the same question as above, which will recommend you 5 courses similar to this one, and add it to your profile.|
| |3. ALSO, you can ask: "Can you recommend me new courses ?", which will give your 5 recommendations of courses to attend to, based on your user profile.|
| |4. FINALLY, you can ask: "Reset my user profile please", which will reset your history of courses in your profile. You can use this if the recommendations we give you do not correspond to your interests anymore|
||Have fun learning new things on Coursera !!! IF you need help again, just ask !|

### Getting a recommendation based on a course:
| User              | Bot                                                      |
|-------------------|----------------------------------------------------------|
| I liked Fundamentals of Reinforcement Learning, can you recommend me any course ?    | Here are the courses you might like: |
| | Course 1 (Messenger Template with: Image, Title, More info)       |
| | Course 2 (Messenger Template with: Image, Title, More info)       |
| | Course 3 (Messenger Template with: Image, Title, More info)       |
| | Course 4 (Messenger Template with: Image, Title, More info)       |
| | Course 5 (Messenger Template with: Image, Title, More info)       |

### Getting a recommendation based on a your user preferences:
| User                      | Bot                                                |
|---------------------------|----------------------------------------------------|                      
| Can you recommend me new courses ? | Here are the courses you might like based on your profile: |
| | Course 1 (Messenger Template with: Image, Title, More info)       |
| | Course 2 (Messenger Template with: Image, Title, More info)       |
| | Course 3 (Messenger Template with: Image, Title, More info)       |
| | Course 4 (Messenger Template with: Image, Title, More info)       |
| | Course 5 (Messenger Template with: Image, Title, More info)       |

### Resetting your user profile:
| User                      | Bot                                                |
|---------------------------|----------------------------------------------------|                      
| Can you reset my user profile please ? | Your courses history has been emptied. Have fun giving us new ones, we hope we can give you even better recommendations this time! |
| reset my profile | Your courses history has been emptied. Have fun giving us new ones, we hope we can give you even better recommendations this time! |
| I don't like the same things anymore | Your courses history has been emptied. Have fun giving us new ones, we hope we can give you even better recommendations this time! |





