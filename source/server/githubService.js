var request = require('request');

exports.getCommits = function(cb,repo,owner,commitsNum,sortBy){

  var options = {
    url: 'https://api.github.com/repos/' + repo + '/' + owner + '/commits',
    headers: {'User-Agent': 'request'}
  }

  request(options, function(err,res) {

    if (err) return cb(err,null);

    var bodyJSON = JSON.parse(res.body);
    var commits = [];

    for (var i=0;i<bodyJSON.length;i++){
      if (i==commitsNum)break;      
      commits.push(bodyJSON[i]);
    }

    return cb(null,commits);

  });

}
