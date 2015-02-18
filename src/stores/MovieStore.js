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

	addMovie(data) {
		console.log('addMovie', data)
	}

	removeMovie(data) {
		console.log('removeMovie', data)
	}

	queryMovie(data) {
		console.log('queryMovie using jQuery?', data)
		this._lastRequest = request.get(this._OMDBI_URL)
			.query({ t: data, plot: 'short', r: 'json' })
			.end((resp) => {
				console.log('MARCIN :: resp data ::', resp)
				this._foundMovie = JSON.parse(resp.text)
				this.emitChange()
			})
	}
}
