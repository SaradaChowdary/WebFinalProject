
var express  = require('express');
var path = require('path');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)

const exphbs = require('express-handlebars');

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(express.static(path.join(__dirname, 'public')));

// Intializing template engine
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',runtimeOptions:{
        allowProtoPropertiesByDefault:true,
        allowProtoMethodsByDefault:true
    } 
}));
app.set('view engine', 'hbs');

var Movies = require('./models/movie');

async function intialize(dburl) {

    try {
        await mongoose.connect(dburl, { useNewUrlParser: true });
        return await true;
    } catch (error) {
        return await console.error(error);
    }   
}

async function addNewMovieData(data){
    Movies.create(data);
    try{
        let movieresult = await Movies.find();
        // await console.log(movieresult);
        return await movieresult;
    }catch(error){
        console.log(error);
    }
}

async function getAllMovies(page,perPage,movietitle){
    try {
		const movie = await Movies.find().sort(
			{ _id: 1 }).limit(page*perPage);
        const movieData = movie.slice((page*perPage-perPage));
        console.log(movieData);
        // movie.slice(page -1)
            if(movietitle != null)
            {
                movieData.forEach(element => {
                    console.log(element.title);
                    if(element.title == movietitle){
                        titleresult = element;
                    }
                });
                console.log(titleresult);
                return await titleresult;
            }
            else{
                return await movieData;
            }
            
	}
	catch (error) {
		console.error(error);
	}
}

async function getMovieById(id){
    try{
        let movieresult = await Movies.findById(id);
        return await movieresult; 
    }catch(error){
        console.log(error);
    }
};

async function updateMovieByID(data, id){

    try{
        await Movies.findByIdAndUpdate(id, data)
        return await true; 
    }catch(error){
        console.log(error);
    }
}

async function deleteMovieById(id){
    await Movies.remove({
		_id : id
    })
	return await true;	
}

async function formMovie(page,perPage,movietitle){
    try {
		const movie = await Movies.find().sort(
			{_id: 1 }).limit(page*perPage)
        const movieData = movie.slice(page*perPage-perPage);
        console.log(movieData);
        if(movietitle != null){
            movieData.forEach(element => {
                console.log(element.title);
                if(element.title == movietitle){
                    titleresult = element;
                }
            });
            console.log(titleresult);
            return await titleresult;
        }
        else{
            return await movieData;
        }
	}
	catch (error) {
		console.error(error);
	}
}

module.exports = {
    intialize: intialize,
    addNewMovieData: addNewMovieData,
    getMovieById: getMovieById,
    updateMovieByID: updateMovieByID,
    deleteMovieById: deleteMovieById,
    getAllMovies: getAllMovies,
    formMovie: formMovie
};