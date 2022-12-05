// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
MovieSchema = new Schema({
    plot : String,
    genres : [String],
    runtime:Number,
    metacritic:Number,
	cast : [String],
    poster:String,
    num_mflix_comments : Number,
    title : String,
    fullplot : String,
    languages:[String],
    countries : [String],
    released : {type:Date},
    writers:[String],
    directors : [String],
    rated : String,
    awards : {
        wins:Number,
        nominations:Number,
        text:String
    },
    lastupdated:{type:Date},
    year:Number,
    imdb:{
        rating:Number,
        votes:Number,
        id:Number
    },
    type:String,
    tomatoes:{
        website:String,
        viewer:{
            rating:Number,
            numReviews:Number,
            meter:Number
        },
        dvd:{type:Date},
        critic:{
            rating:Number,
            numReviews:Number,
            meter:Number
        },
        boxOffice:String,
        rotten:Number,
        production:String,
        lastUpdated:{type:Date},
        fresh:Number
    }
});
module.exports = mongoose.model('movie', MovieSchema);