var request = require('request');
var fs = require('fs');
var args = process.argv.slice(2);
require('dotenv').config();

console.log('Welcome to the GitHub Avatar Downloader!');

function printArgError() {
    if (args[0] === undefined || args[1] === undefined) throw new Error('You did not input the repo owner and name. Please input both in the correct order (owner, name)');
    if (args[2] !== undefined) console.log('You input too many arguments. Please input two (owner, name.');
}

printArgError();

function getRepoContributors(repoOwner, repoName, cb) {
    let options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            authorization: process.env.GITHUB_TOKEN
        }
    };
    
    request(options, function(err, res, body) {
        if (res.statusCode !== 200) throw new Error('Request failed');
        cb(err, body);
    });
}

function downloadImageByURL(url, filePath) {

    let writeStream =  fs.createWriteStream('./avatars/' + filePath + '.jpg');
    
    writeStream.on('error', function(err) {
        console.log('Something wrong with the file path')
        writeStream.end();
    });

    request.get(url)
    .on('error', function (err) {
        throw err;
    })
    .pipe(writeStream);

}

getRepoContributors(args[0], args[1], function(err, result) {
    console.log("Errors:", err)
    let jsonResObj = JSON.parse(result)
    for (let contributor of jsonResObj) {
        downloadImageByURL(contributor.avatar_url, contributor.login);
    }
});