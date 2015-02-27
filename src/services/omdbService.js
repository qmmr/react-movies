import { OMDB_URL } from '../constants/constants'
import request from 'superagent'
import parseJSON from '../utils/parseJSON'

export default function omdbService(actions) {
	var handleResponse = (resp) => {
		let data = parseJSON(resp.text)

		if (data.Error) {
			actions.notFoundMovie(data)
		} else {
			actions.foundMovie(data)
		}
	}

	var handleOMDBError = (err) => {
		if (err) {
			actions.handleOMDBError(err)
		} else {
			console.error(`Oops, I got ${ err.status } response...`)
		}
	}

	return {

		queryMovie(title) {
			return request
				.get(OMDB_URL)
				.query({ t: title, plot: 'short', r: 'json' })
				.accept('application/json')
				.on('error', handleOMDBError)
				.end(handleResponse)
		}

	}
}
