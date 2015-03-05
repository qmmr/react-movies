import { EventEmitter } from 'events'
import {
	ADD_FAVORITE_MOVIE,
	REMOVE_FAVORITE_MOVIE,
	// ADD_WATCH_LATER_MOVIE,
	// ADD_HATE_MOVIE,
	QUERY_MOVIE,
	MOVIE_DATA,
	NO_MOVIE_DATA,
	OMDB_ERROR
} from '../constants/actionTypes'
import { CHILD_ADDED, CHILD_REMOVED } from '../constants/firebaseTypes'
import { VIEW_ACTION, SERVER_ACTION } from '../constants/sourceTypes'

const CHANGE_EVENT = 'CHANGE_EVENT'

export default class MoviesStore extends EventEmitter {
	constructor(dispatcher, firebaseService, omdbSvc) {
		this._dispatchToken = dispatcher.register(this.handleAction.bind(this))
		this._firebaseService = firebaseService
		this._omdbSvc = omdbSvc
		this._foundMovie = null
		this._favoriteMovies = []
		this._queryInProgress = false
		this._lastRequest = null

		this._firebaseService.on(CHILD_ADDED)
		this._firebaseService.on(CHILD_REMOVED)

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

	isQueryInProgress() {
		return this._queryInProgress
	}

	getLastRequest() {
		return this._lastRequest
	}

	// private methods

	handleAction({ source, action: { type, data } }) {
		if (source === SERVER_ACTION) {
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
				case CHILD_ADDED:
					this._addToFavoriteMoviesArray(data)
					this.emitChange()
					break
				case CHILD_REMOVED:
					this._removeFromFavoriteMoviesArray(data)
					this.emitChange()
					break
			}
		}

		if (source === VIEW_ACTION) {
			switch (type) {
				case ADD_FAVORITE_MOVIE:
					this._pushFavoriteMovieToFirebase(data)
					this.emitChange()
					break
				case REMOVE_FAVORITE_MOVIE:
					this._removeFavoriteMovieFromFirebase(data)
					break
				case QUERY_MOVIE:
					this._foundMovie = null
					this._queryMovie(data)
					break
			}
		}
	}

	// private methods

	_queryMovie(title) {
		this._lastRequest = this._omdbSvc.queryMovie(title)
		this._startQueryProgress()
		this.emitChange()
	}

	_pushFavoriteMovieToFirebase(movie) {
		this._firebaseService.addToFavoriteMovies(movie)
		this._foundMovie = null
	}

	_removeFavoriteMovieFromFirebase(key) {
		this._firebaseService.removeFromFavoriteMovies(key)
	}

	_addToFavoriteMoviesArray(movie) {
		this._favoriteMovies.push(movie)
	}

	_removeFromFavoriteMoviesArray(key) {
		this._favoriteMovies = this._favoriteMovies.filter((movie) => movie.firebaseKey !== key)
	}

	_addFoundMovie(data) {
		this._stopQueryProgress()
		this._foundMovie = data
	}

	_addNotFoundMovie(data) {
		this._stopQueryProgress()
		this._foundMovie = data
	}

	_startQueryProgress() {
		this._queryInProgress = true
	}

	_stopQueryProgress() {
		this._queryInProgress = false
	}

}
