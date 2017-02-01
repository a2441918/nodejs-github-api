var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var githubService = require('./githubService');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = require('http').createServer(app);

server.listen(3000,function () {
  console.log("Express server is listening");
});

app.get('/commits/recent', function (req, res) {
  githubService.getCommits(function(err,commits){
    if (err) console.log(err);

    res.write('<html><body>');
    for (var i=0;i<commits.length;i++){
      var lastCharIsNum = !isNaN(commits[i].sha.charAt(commits[i].sha.length-1));
      if (lastCharIsNum) res.write('<div style="background: #ADD8E6; width: auto">')
      res.write('<h1>Author</h1></>'+JSON.stringify(commits[i].author)+'</>');
      res.write('<h2>Commit</h2></>'+JSON.stringify(commits[i]));
      if (lastCharIsNum) res.write('</div>');
    }
    res.write('</body></html>');
    res.end();
  },'nodejs','node',25,'latest');
});
