import { EventEmitter } from 'events'
import {
	ADD_FAVORITE_MOVIE,
	REMOVE_FAVORITE_MOVIE,
	ADD_WATCH_LATER_MOVIE,
	ADD_HATE_MOVIE,
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
		this._watchLaterMovies = []
		this._hateMovies = []
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

	// private methods

	_handleAction({ source, action: { type, data } }) {
		console.log('%cMARCIN :: MoviesStore.js:55 :: _handleAction', 'background: #222; color: lime', source, type, data)

		switch (type) {
			case ADD_FAVORITE_MOVIE:
				this._addFavoriteMovie(data)
				break
			case ADD_WATCH_LATER_MOVIE:
				this._addWatchLaterMovie(data)
				break
			case ADD_HATE_MOVIE:
				this._addHateMovie(data)
				break
			case REMOVE_FAVORITE_MOVIE:
				this._removeFavoriteMovie(data)
				break
			case QUERY_MOVIE:
				this._queryMovie(data)
				break
		}

		return true
	}

	_handleError({ error, status }) {
		if (error) {
			console.error(`Oops, sorry :( ${ error.message }`)
		} else {
			console.error(`Oops, I got ${ status } response...`)
		}
	}

	_queryMovie(data) {
		// console.log('%cMARCIN :: MoviesStore.js:31 :: _queryMovie data', 'background: #222; color: lime', data)
		this._lastRequest = request.get(this._OMDBI_URL)
			.query({ t: data, plot: 'short', r: 'json' })
			.on('error', this._handleError)
			.end((resp) => this._addQueriedMovie(resp.text))
	}

	_addFavoriteMovie(movie) {
		console.log('%cMARCIN :: MoviesStore.js:81 :: _addFavoriteMovie movie', 'background: #222; color: lime', movie)
		this._favoriteMovies.push(movie)
		console.log('%cMARCIN :: MoviesStore.js:81 :: this._favoriteMovies', 'background: #222; color: lime', this._favoriteMovies)
		this._foundMovie = null
		this.emitChange()
	}

	_addWatchLaterMovie(movie) {
		this._watchLaterMovies.push(movie)
		this.emitChange()
	}

	_addHateMovie(movie) {
		this._hateMovies.push(movie)
		this.emitChange()
	}

	_removeFavoriteMovie(idx) {
		this._favoriteMovies.splice(idx, 1)
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

}
