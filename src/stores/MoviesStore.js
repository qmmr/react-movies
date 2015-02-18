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
	constructor(dispatcher, favoriteMoviesFBSvc) {
		this._dispatchToken = dispatcher.register(this._handleAction.bind(this))
		this._favoriteMoviesFBSvc = favoriteMoviesFBSvc
		this._OMDBI_URL = 'http://www.omdbapi.com/'
		this._foundMovie = null
		this._favoriteMovies = []
		this._watchLaterMovies = []
		this._hateMovies = []
		this._lastRequest = null

		this._listenToFavoriteMoviesSvc()

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

	_listenToFavoriteMoviesSvc() {
		this._favoriteMoviesFBSvc.on('child_added', (dataSnapshot) => {
			let movie = dataSnapshot.val()
			movie.firebaseKey = dataSnapshot.key()

			this._favoriteMovies.push(movie)
			this.emitChange()
		})

		this._favoriteMoviesFBSvc.on('child_removed', (dataSnapshot) => {
			this._removeFromFavoriteMovies(dataSnapshot.key())
		})
	}

	_handleOMDBIError({ error, status }) {
		if (error) {
			console.error(`Oops, sorry :( ${ error.message }`)
		} else {
			console.error(`Oops, I got ${ status } response...`)
		}
	}

	_removeFromFavoriteMovies(key) {
		this._favoriteMovies = this._favoriteMovies.filter((movie) => movie.firebaseKey !== key)
		this.emitChange()
	}

	_queryMovie(data) {
		this._lastRequest = request.get(this._OMDBI_URL)
			.query({ t: data, plot: 'short', r: 'json' })
			.on('error', this._handleOMDBIError)
			.end((resp) => this._addQueriedMovie(resp.text))
	}

	_addFavoriteMovie(movie) {
		let favoriteMovieRef = this._favoriteMoviesFBSvc.push(movie)

		movie.firebaseKey = favoriteMovieRef.key()
		this._foundMovie = null

		this.emitChange()
	}

	_addWatchLaterMovie(movie) {
		// this._watchLaterMovies.push(movie)
		// this.emitChange()
	}

	_addHateMovie(movie) {
		// this._hateMovies.push(movie)
		// this.emitChange()
	}

	_removeFavoriteMovie(key) {
		let movieRef = this._favoriteMoviesFBSvc.child(key)

		movieRef.remove((err) => {
			if (err) {
				console.error(err)
			} else {
				console.log(`movie ${ key } was removed`)
			}
		})
	}

	_addQueriedMovie(data) {
		if (typeof data === 'string') {
			this._foundMovie = JSON.parse(data)
			this.emitChange()
		}
	}

}
