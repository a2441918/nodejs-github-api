var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var request = require('request');
var githubService = require('./githubService');
var jsonMarkup = require('json-markup')


mongoose.connect('mongodb://google:google123@ds147069.mlab.com:47069/node-github');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);
app.get('/commits/recent', function (req, res) {
  githubService.getCommits(function(err,commits){
    if (err) console.log(err);

    res.write('<html><body>');
    for (var i=0;i<commits.length;i++){
      var lastCharIsNum = !isNaN(commits[i].sha.charAt(commits[i].sha.length-1));
      if (lastCharIsNum) res.write('<div style="background: #ADD8E6; width: auto; word-wrap: break-word">')
      var data = commits[i];
      var formattedText = JSON.stringify(data,undefined,2);
      console.log(formattedText);
      var n = i+1;
      res.write('<h2>Commit '+n+'</h2>');
      res.write('<pre id="text'+n+'"></pre>');
      res.write('<script>document.getElementById("text'+n+'").innerHTML=JSON.stringify('+formattedText+');</script>');
      if (lastCharIsNum) res.write('</div>');
    }
    res.write('</body></html>');
    res.end();
  },'nodejs','node',25,'latest');
});

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
