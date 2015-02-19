import { EventEmitter } from 'events'
import { CHANGE_EVENT } from '../constants/routingTypes'
import request from 'superagent'

export default class MovieStore extends EventEmitter {
	constructor() {
		this._OMDBI_URL = 'http://www.omdbapi.com/'
		this._movies = []
		this._foundMovie = null
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

	getMovies() {
		return this._movies
	}

	getFoundMovie() {
		return this._foundMovie
	}

	queryMovie(data) {
		console.log('queryMovie using jQuery?', data)
		this._lastRequest = request.get(this._OMDBI_URL)
			.query({ t: data, plot: 'short', r: 'json' })
			.end((resp) => this._addMovie(resp.text))
	}

	_addMovie(data) {
		if (typeof data === 'string') {
			data = JSON.parse(data)
		}

		console.log('addMovie', data)
		this._foundMovie = data
		this.emitChange()
	}

	_removeMovie(data) {
		console.log('removeMovie', data)
	}

}
