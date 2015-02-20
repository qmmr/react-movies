import { EventEmitter } from 'events'
import {
	ADD_FAVORITE_MOVIE,
	REMOVE_FAVORITE_MOVIE,
	QUERY_MOVIE
} from '../constants/actionTypes'
import request from 'superagent'

const CHANGE_EVENT = 'CHANGE_EVENT'

export default class MoviesStore extends EventEmitter {
	constructor(dispatcher) {
		this._dispatchToken = dispatcher.register(this._handleAction.bind(this))
		this._OMDBI_URL = 'http://www.omdbapi.com/'
		this._foundMovie = null
		this._favoriteMovies = []
		this._lastRequest = null

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

	// getters

	getFoundMovie() {
		return this._foundMovie
	}

	getFavoriteMovies() {
		return this._favoriteMovies
	}

	queryMovie(data) {
		console.log('%cMARCIN :: MoviesStore.js:31 :: queryMovie data', 'background: #222; color: lime', data)
		this._lastRequest = request.get(this._OMDBI_URL)
			.query({ t: data, plot: 'short', r: 'json' })
			.end((resp) => this._addQueriedMovie(resp.text))
	}

	// private methods

	_handleAction({ source, action: { type, data } }) {
		console.log('appDispatcher.register', source, type, data)

		switch(type) {
			case ADD_FAVORITE_MOVIE:
				this._addFavoriteMovie(data)
				break
			case REMOVE_FAVORITE_MOVIE:
				this.removeFavoriteMovie(data)
				break
			case QUERY_MOVIE:
				this.queryMovie(data)
				break
		}

		return true
	}

	_addFavoriteMovie(movie) {
		this._favoriteMovies.push(movie)
		this.emitChange()
	}

	_addQueriedMovie(data) {
		if (typeof data === 'string') {
			data = JSON.parse(data)
		}

		console.log('_addMovie', data)
		this._foundMovie = data
		this.emitChange()
	}

	// removeMovie(idx) {
	// 	console.log('%cMARCIN :: FavoriteMoviesStore.js:33 :: idx', 'background: #222; color: lime', idx)
	// 	console.log('MARCIN :: this._movies ::', this._movies)
	// 	this._movies = this._movies.filter((movie, idx) => idx !== movie.idx)
	// 	console.log('MARCIN :: this._movies ::', this._movies)
	// }
}
