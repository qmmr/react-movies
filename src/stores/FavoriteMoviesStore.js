import { EventEmitter } from 'events'
import { CHANGE_EVENT } from '../constants/routingTypes'

export default class MovieStore extends EventEmitter {
	constructor() {
		this._movies = []

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

	addMovie(movie) {
		this._movies.push(movie)
	}

}
