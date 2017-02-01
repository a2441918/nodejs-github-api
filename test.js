var request = require('supertest');
var express = require('express');
var router = express.Router();
var path = require('path'); 

/* GET home page. */
router.get('/', function(req, res, next) {
		res.render('index', { title: 'Express' });
		});

//This route lists the recent commits on the repository. 
router.get('/commits/recent',  function(req, res, next) {


		var GitHub = require('./githubService');

		// token auth
		var gh = new githubService({
token: 'cbfdd2234c866f8ae1bb41f1cdc0585aa1b4b00f '
});

		var repo = gh.getRepo('nodejs', 'node');
		console.log(repo);


		repo.getCommits()
		.then(function({data: bodyJSON}) {
			res.jsonp(bodyJSON)
			});


});


//This does the following: 
//1. Lists the last 25 commit SHAs on the node repository by author.
//2. Displays commit SHAs that end with a number and commit SHAs that do not end with a number.
//3. SHAs ending with a number are color coded. 
router.get('/commits/recent',  function(req, res, next) {

//Connect to Github via token authentication. 

		var githubService = require('./githubService');

		// token auth
		var gh = new githubService({
token: 'cbfdd2234c866f8ae1bb41f1cdc0585aa1b4b00f '
});


var repo = gh.getRepo('nodejs', 'node');
console.log(repo);

//1. List all commits that belong to user: jonniedarko
//2. Check to see which SHA ends with an integer and which SHA does not. 

repo.listCommits({author: 'jonniedarko'})
.then(function({data: bodyJSON}) {

	var re = new RegExp('([0-9]+)$');
    var numberResponse = []; 
	var nonNumberResponse = []; 
	for (var i=0; i<25; i++) {

	if(bodyJSON[i].sha.match(re)) {


	numberResponse.push("\n" + bodyJSON[i].sha) 
	}
	else { 

	nonNumberResponse.push("\n" + bodyJSON[i].sha);
	

	}
	
}	
//Render the results in HTML:  		
	res.render('index', {title: 'Nodejs Code Challenge ', nonNumberResponse: nonNumberResponse, numberResponse: numberResponse}); 

});
});

 
module.exports = router;

describe('GET /commits/recent', function() {
  it('looking for 200 response', function(done) {
    request(router)
      .get('/commits/recent')
      .expect(200);
      done(); 
  });
});

describe('Color Code Verification', function() { 
		
	var url = "http://localhost:3000/commits/recent"

	it("returns color code #ADD8E6", function(done) { 
	request(url, function(error, response, body) { 
	console.log(body);
	expect(body).to.equal("ADD8E6"); 
	done(); 
}); 
}); 
}); 