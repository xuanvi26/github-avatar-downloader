const request = require('request');
const args = process.argv.slice(2);
require('dotenv').config();

function fetchUserData(repoOwner, repoName, cb, cb2) {
    let options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            authorization: process.env.GITHUB_TOKEN
        }
    };
    
    request(options, function(err, res, body) {
        if (res.statusCode !== 200) throw new Error(`Request failed ${JSON.stringify(res, null, 2)}`);
        cb(err, JSON.parse(body), cb2);
    });

}

function fetchStarredReposUrls(err, body, cb) {
    let starredReposUrls = [];
    body.forEach(user => {
        starredReposUrls.push(user.starred_url);
    });
    cb(starredReposUrls);
}

function fetchStarredRepos(repoUrl) {
    let repoDetails = {};
    repoUrl.forEach((starredReposUrl) => {
        request({
            url: starredReposUrl.replace('{/owner}{/repo}', ''),
            headers: {
                'User-Agent': 'request', 
                authorization: process.env.GITHUB_TOKEN
            }
        }, function(err, res, body) {
            if (res.statusCode !== 200) throw new Error(`Request failed ${JSON.stringify(res, null, 2)}`);
            else {
                JSON.parse(body).forEach((repo) => {
                    (repoDetails[repo.full_name] === undefined) ? repoDetails[repo.full_name] = 1 : repoDetails[repo.full_name] += 1;
                })
            }
            console.log(repoDetails);
        })
    });
}


fetchUserData(args[0], args[1], fetchStarredReposUrls, fetchStarredRepos);