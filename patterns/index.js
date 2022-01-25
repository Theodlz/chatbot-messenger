const patternDict = [{
    pattern: '\\b(?<greeting>Hi|Hello|Hey)\\b',
    intent: 'Hello'
    },
    {
    pattern: '\\b(?<exiting>bye|exit)\\b',
    intent: 'Exit'  
    },
    {
    pattern: `\\b(weather)\\s(like\\s)?in\\s\\b(?<city>[A-Za-z]+( [A-Za-z]+)?)\\s\\b(?<time>tomorrow|today)`,
    intent: 'get weather'
    },
    {
    pattern: `\\b(weather)\\s(like\\s)?in\\s\\b(?<city>[A-Za-z]+( [A-Za-z]+)?)\\b`,
    intent: 'get current weather'
    },
];

module.exports = patternDict;
    