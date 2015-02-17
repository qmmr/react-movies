import { EventEmitter } from 'events'
import { CHANGE_EVENT } from '../constants/routingTypes'

export default class MovieStore extends EventEmitter {
	constructor() {
		this._movies = [
			{
				Title: "Horrible Bosses 2",
				Year: "2014",
				Rated: "R",
				Released: "26 Nov 2014",
				Runtime: "108 min",
				Genre: "Comedy, Crime",
				Director: "Sean Anders",
				Writer: "Sean Anders (screenplay), John Morris (screenplay), Jonathan M. Goldstein (story), John Francis Daley (story), Sean Anders (story), John Morris (story), Michael Markowitz (characters)",
				Actors: "Jason Bateman, Jason Sudeikis, Charlie Day, Jennifer Aniston",
				Plot: "Fed up with answering to higher-ups, Nick, Dale and Kurt decide to become their own bosses by launching their own business. But a slick investor soon pulls the rug out from under them. Outplayed and desperate, and with no legal recourse, the three would-be entrepreneurs hatch a misguided plan to kidnap the investor's adult son and ransom him to regain control of their company.",
				Language: "English",
				Country: "USA",
				Awards: "1 win & 1 nomination.",
				Poster: "http://ia.media-imdb.com/images/M/MV5BNzU4OTEzNzAwN15BMl5BanBnXkFtZTgwMTgwODAwMzE@._V1_SX300.jpg",
				Metascore: "40",
				imdbRating: "6.6",
				imdbVotes: "36,193",
				imdbID: "tt2170439",
				Type: "movie",
				Response: "True"
			},
			{
				Title: "Fury",
				Year: "2014",
				Rated: "R",
				Released: "17 Oct 2014",
				Runtime: "134 min",
				Genre: "Action, Drama, War",
				Director: "David Ayer",
				Writer: "David Ayer",
				Actors: "Brad Pitt, Shia LaBeouf, Logan Lerman, Michael Peña",
				Plot: "April, 1945. As the Allies make their final push in the European Theatre, a battle-hardened army sergeant named Wardaddy (Brad Pitt) commands a Sherman tank and his five-man crew on a deadly mission behind enemy lines. Outnumbered and outgunned, Wardaddy and his men face overwhelming odds in their heroic attempts to strike at the heart of Nazi Germany.",
				Language: "English, German",
				Country: "USA, China, UK",
				Awards: "4 wins & 10 nominations.",
				Poster: "http://ia.media-imdb.com/images/M/MV5BMjA4MDU0NTUyN15BMl5BanBnXkFtZTgwMzQxMzY4MjE@._V1_SX300.jpg",
				Metascore: "64",
				imdbRating: "7.8",
				imdbVotes: "136,960",
				imdbID: "tt2713180",
				Type: "movie",
				Response: "True"
			}
		]

		super()
	}

	emitChange() {
		this.emit(CHANGE_EVENT)
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback)
	}

	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback)
	}

	getMovies() {
		return this._movies
	}

	addMovie(data) {
		console.log('addMovie', data)
	}

	removeMovie(data) {
		console.log('removeMovie', data)
	}
}
