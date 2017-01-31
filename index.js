var underscore = require("underscore");
var redis = require("redis");
var redisClient = redis.createClient();
var express = require("express")
var app = express();
var bodyParser = require('body-parser');

db = require('seraph')("http://localhost:7474");


app.use(bodyParser.json({limit:'50mb'}))
app.use('/public', express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

/* Controllers */
	require('./controllers')(app,db);
/* End Controllers */



app.get("/",index)



function index(req,res)
{
	res.render("map.html");

}



var server = app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});


