const http = require('http');
const url = require('url');
var express  = require('express');
var path = require('path');
var mongoose = require('mongoose');
require('dotenv').config()
var app = express();
const bcrypt = require('bcrypt');
// var database = require('./config/database');
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
 
const exphbs = require('express-handlebars');

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(express.static(path.join(__dirname, 'public')));

const userdata=[];

// Intializing template engine
app.engine('.hbs', exphbs.engine({ 
	extname: '.hbs',runtimeOptions:{
		allowProtoPropertiesByDefault:true,
		allowProtoMethodsByDefault:true
	} 
}));
app.set('view engine', 'hbs');

var Movies = require('./models/movie');
var allModules = require('./allmodules');
	
async function dbconnect() {
	var conResult = await allModules.intialize(process.env.DATABASEURL);
	if(conResult == true)
	{
		app.listen(port);
		console.log("App listening on port : " + port);
	}
	else{
		console.log(conResult);
	}
}
dbconnect();

// Create a new Record
app.post('/api/moviescreate', async function(req, res) {

    // create mongose method to create a new record into collection
	var data = {
		plot : req.body.plot,
		genres : req.body.genres,
		runtime: req.body.runtime,
    	metacritic:req.body.metacritic,
		cast : req.body.cast,
		poster:req.body.poster,
		num_mflix_comments : req.body.num_mflix_comments,
		title : req.body.title,
		fullplot : req.body.fullplot,
		languages: req.body.languages,
		countries : req.body.countries,
		released : req.body.released,
		writers: req.body.writers,
		directors : req.body.directors,
    	rated : req.body.rated,
		awards : {
			wins: req.body.wins,
			nominations: req.body.nominations,
			text: req.body.text
		},
		lastupdated:req.body.lastUpdated,
    	year:req.body.year,
		imdb:{
			rating: req.body.imdbrating, // comments
			votes:req.body.imdbvotes,
        	id:req.body.imdbid
		},
		type: req.body.type,
		tomatoes:{
			website:req.body.website,
			viewer:{
				rating: req.body.viewerrating, // comments
				numReviews: req.body.viewernumReviews, // comments
				meter: req.body.viewermeter // comments
			},
			dvd:req.body.dvd,
        	critic:{
				rating:req.body.criticrating,
				numReviews:req.body.criticnumReviews,
				meter:req.body.meter
        	},
			boxOffice:req.body.boxOffice,
			rotten:req.body.rotten,
			production:req.body.production,
			fresh:req.body.fresh
		}
	};
	// console.log(allModules.addNewMovieData(data));
	var result = await allModules.addNewMovieData(data);
	console.log("checking");
	await res.send(result);
});

app.get("/api/getallmovies", async (req, res, next) => {

	const queryObject = url.parse(req.url, true).query;
	//let params = new URLSearchParams(window.location.search);
	let { page, size, title } = queryObject; // req.query
	// If the page is not applied in query.
	if (!page) {
		// Make the Default value one.
		page = 1;
	}
	if (!size) {
		size = 1;
	}
	const limit = parseInt(size);
	
	var result =  await allModules.getAllMovies(page,limit,title);
	await res.send({
		page,
		size,
		Info: result
	});
});

// find a record using ID
app.get('/api/movies/:movie_id', async function(req, res) {
	let id = req.params.movie_id;
	var result = await allModules.getMovieById(id);
	await res.send(result);
});

app.put('/api/movies/:movie_id', async function(req, res) {
	// create mongose method to update an existing record into collection

	let id = req.params.movie_id;
	var data = {
		plot : req.body.plot,
		genres : req.body.genres,
		runtime: req.body.runtime,
    	metacritic:req.body.metacritic,
		cast : req.body.cast,
		poster:req.body.poster,
		num_mflix_comments : req.body.num_mflix_comments,
		title : req.body.title,
		fullplot : req.body.fullplot,
		languages: req.body.languages,
		countries : req.body.countries,
		released : req.body.released,
		writers: req.body.writers,
		directors : req.body.directors,
    	rated : req.body.rated,
		awards : {
			wins: req.body.wins,
			nominations: req.body.nominations,
			text: req.body.text
		},
		lastupdated:req.body.lastUpdated,
    	year:req.body.year,
		imdb:{
			rating: req.body.imdbrating, // comments
			votes:req.body.imdbvotes,
        	id:req.body.imdbid
		},
		type: req.body.type,
		tomatoes:{
			website:req.body.website,
			viewer:{
				rating: req.body.viewerrating, // comments
				numReviews: req.body.viewernumReviews, // comments
				meter: req.body.viewermeter // comments
			},
			dvd:req.body.dvd,
        	critic:{
				rating:req.body.criticrating,
				numReviews:req.body.criticnumReviews,
				meter:req.body.meter
        	},
			boxOffice:req.body.boxOffice,
			rotten:req.body.rotten,
			production:req.body.production,
			fresh:req.body.fresh
		}
	};

	// console.log(allModules.addNewMovieData(data));
	var result = await allModules.updateMovieByID(data, id);
	console.log(result);
	if(result == true)
		res.send("Successfully Updated");
	else
		console.log("Updated Failed");
});

 app.delete('/api/movies/:movie_id', async function(req, res) {
	let id = req.params.movie_id;
	var result = await allModules.deleteMovieById(id);
	if (result){
		await res.send("Movie Deleted");
	}
	else{
		console.log("Movie not deleted");
	}
});

// Handling GET /send Request


app.get("/api/movieform",(req,res)=>{    
    res.render('moviedata'); 
});

app.post("/api/movieform",async (req,res) => { 

	page = req.body.pageno;
	limit = req.body.pagesize;
	title = req.body.title;
	var result = await allModules.formMovie(page,limit,title);
	await res.render('movieresult', {data: result});
  }
)

app.get("/",(req,res)=>{
	res.render('login');
});

app.post("/",(req,res)=>{
	uname1 = req.body.username;
	pass = req.body.password;

	console.log(uname1);
	console.log(pass);
	console.log(process.env.userdata);
	//console.log(userdata[0].username);
	userdata.forEach(element => {
		if(element.username==uname1 && element.password==pass)
		{
			bcrypt.compare(element.password, element.hash).then((result) => {
				// result	 === true
				console.log(result);
				if(result == true){
					res.render('loginsuccess');
				}
				else{
					res.render('errorlogin');
				}
			});
		}
		else
		{
			res.render('errorlogin');
		}
	});	
});

app.get("/register",(req,res)=>{
	res.render("register");
})

app.post("/register",(req,res)=>{

	uname = req.body.reg_username;
	pass = req.body.reg_password;

	bcrypt.hash(pass, 5).then(h=>{ // Hash the password using a Salt that was generated using 10 rounds
		console.log(h)
		userdata.push({
			username:uname,
			password:pass,
			hash:h
		})
		console.log(userdata);

		// process.env.userdata.push({
		// 		username:uname,
		// 		password:pass,
		// 		hash:h
		// })

		})
		.catch(err=>{
		console.log(err); // Show any errors that occurred during the process
	});
});