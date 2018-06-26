var request = require('request');
var secrets = require('./secrets')
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    let options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            authorization: secrets.GITHUB_TOKEN
        }
    }
    
    request(options, function(err, res, body) {
        cb(err, body);
    })
}

function downloadImageByURL(url, filePath) {
    request.get(url)
    .on('error', function (err) {
        throw err;
    })
    .pipe(fs.createWriteStream('./avatars/' + filePath + '.jpg'))
}

getRepoContributors("jquery", "jquery", function(err, result) {
    console.log("Errors:", err);
    let jsonResObj = JSON.parse(result);
    for (let contributor of jsonResObj) {
        downloadImageByURL(contributor.avatar_url, contributor.login);
    }
});