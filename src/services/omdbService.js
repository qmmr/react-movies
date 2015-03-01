import request from 'superagent'
import parseJSON from '../utils/parseJSON'

export default function createOmdbService(actions) {
	const OMDB_URL = 'http://www.omdbapi.com/'
	const MOVIE_NOT_FOUND = 'Movie not found!'

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
			return request.get(OMDB_URL)
				.query({ t: title, plot: 'short', r: 'json' })
				.accept('application/json')
				.on('error', handleOMDBError)
				.end(handleResponse)
		}

	}
}
