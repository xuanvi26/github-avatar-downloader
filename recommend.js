const request = require('request');
const args = process.argv.slice(2);
require('dotenv').config();

function fetchData(repoOwner, repoName, cb) {
    let options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            authorization: process.env.GITHUB_TOKEN
        }
    };
    
    request(options, function(err, res, body) {
        if (res.statusCode !== 200) throw new Error(`Request failed ${JSON.stringify(res, null, 2)}`);
        cb(err, JSON.parse(body));
    });
}

fetchData(args[0], args[1], getStarredRepos);

function getStarredRepos(err, body) {
    let starredReposUrls = [];
    body.forEach(user => {
        starredReposUrls.push(user.starred_url)
        console.log(starredReposUrls)
    }) 
}

