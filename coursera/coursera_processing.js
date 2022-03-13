const contractions = {
    "i'm": "i am",
    "i'd": "i would",
    "i've": "i have",
    "i'll": "i will",
    "you're": "you are",
    "you'd": "you would",
    "you've": "you have",
    "you'll": "you will",
    "he's": "he is",
    "he'd": "he would",
    "he'll": "he will",
    "she's": "she is",
    "she'd": "she would",
    "she'll": "she will",
    "we're": "we are",
    "we'd": "we would",
    "we'll": "we will",
    "we've": "we have",
    "they're": "they are",
    "they'd": "they would",
    "they'll": "they will",
    "they've": "they have",
    "isn't": "is not",
    "aren't": "are not",
    "wasn't": "was not",
    "weren't": "were not",
    "won't": "will not",
    "wouldn't": "would not",
    "don't": "do not",
    "doesn't": "does not",
    "didn't": "did not",
    "can't": "can not",
    "couldn't": "could not",
    "shouldn't": "should not",
    "mightn't": "might not",
    "mustn't": "must not"
};

// list of all punctuation marks
const endOfLine = [
    '\\.',
    '\\?',
    '!',
    ';',
    ':',
    '`',
    '"',
    ',',
    "'",
    `“`,
    `”`,
    `-`,
    `’`,
];
// list of all stopwords
const stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"];


function cleanString(string) {

    let newString = string.toLowerCase();

    // remove all the contractions
    endOfLine.forEach(e => {
        newString = newString.replace(new RegExp(e, 'g'), ' ');
    });

    for (let key in contractions) {
        newString = newString.replace(new RegExp('\\b' + key + '\\b', "g"), ' ');
    }

    // remove all punctuation marks
    stopWords.forEach(s => {
        newString = newString.replace(RegExp('\\b' + s + '\\b', "g"), '');
    });

    // remove all stop words
    // replace multiple spaces with one space
    newString = newString.replace(/\s+/g, ' ');
    return newString;
}

function courseTags(course) {
return cleanString(course.name + course.description.replace(/\n/g, ' '))
}

// export the function courseTags
module.exports = courseTags;


