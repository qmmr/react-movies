import { EventEmitter } from 'events'
import {
	ADD_FAVORITE_MOVIE,
	REMOVE_FAVORITE_MOVIE,
	ADD_WATCH_LATER_MOVIE,
	ADD_HATE_MOVIE,
	QUERY_MOVIE,
	MOVIE_DATA,
	NO_MOVIE_DATA,
	OMDB_ERROR
} from '../constants/actionTypes'
import request from 'superagent'

const CHANGE_EVENT = 'CHANGE_EVENT'

export default class MoviesStore extends EventEmitter {
	constructor(dispatcher, favoriteMoviesFBSvc, omdbSvc) {
		this._dispatchToken = dispatcher.register(this.handleAction.bind(this))
		this._favoriteMoviesFBSvc = favoriteMoviesFBSvc
		this._omdbSvc = omdbSvc
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

	hasFoundMovie() {
		return !!this._foundMovie
	}

	getFavoriteMovies() {
		return this._favoriteMovies
	}

	isLoading() {
		return this._loading
	}

	getLastRequest() {
		return this._lastRequest
	}

	// private methods

	handleAction({ source, action: { type, data } }) {
		if (source === 'SERVER_ACTION') {
			switch (type) {
				case MOVIE_DATA:
					this._addFoundMovie(data)
					this.emitChange()
					break
				case NO_MOVIE_DATA:
					this._addNotFoundMovie(data)
					this.emitChange()
					break
				case OMDB_ERROR:
					console.log(data)
					break
			}
		}

		if (source === 'VIEW_ACTION') {
			switch (type) {
				case ADD_FAVORITE_MOVIE:
					this._addFavoriteMovie(data)
					this.emitChange()
					break
				// case ADD_WATCH_LATER_MOVIE:
				// 	this._addWatchLaterMovie(data)
				// 	this.emitChange()
				// 	break
				// case ADD_HATE_MOVIE:
				// 	this._addHateMovie(data)
				// 	this.emitChange()
				// 	break
				case REMOVE_FAVORITE_MOVIE:
					this._removeFavoriteMovie(data)
					break
				case QUERY_MOVIE:
					this._queryMovie(data)
					break
			}
		}
	}

	// private methods

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

	_removeFromFavoriteMovies(key) {
		this._favoriteMovies = this._favoriteMovies.filter((movie) => movie.firebaseKey !== key)
		this.emitChange()
	}

	_queryMovie(title) {
		this._lastRequest = this._omdbSvc.queryMovie(title)
	}

	_addFavoriteMovie(movie) {
		let favoriteMovieRef = this._favoriteMoviesFBSvc.push(movie)
		movie.firebaseKey = favoriteMovieRef.key()
		this._foundMovie = null
	}

	// _addWatchLaterMovie(movie) {
	// 	this._watchLaterMovies.push(movie)
	// }

	// _addHateMovie(movie) {
	// 	this._hateMovies.push(movie)
	// }

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

	_addFoundMovie(data) {
		this._foundMovie = data
	}

	_addNotFoundMovie(data) {
		this._foundMovie = data
	}

}
