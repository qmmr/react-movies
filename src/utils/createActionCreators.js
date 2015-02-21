import {
	ADD_MOVIE,
	ADD_FAVORITE_MOVIE,
	ADD_WATCH_LATER_MOVIE,
	ADD_HATE_MOVIE,
	REMOVE_FAVORITE_MOVIE,
	QUERY_MOVIE
} from '../constants/actionTypes'

export default function createActionCreators(appDispatcher) {
	return {
		addMovie(data) {
			appDispatcher.handleViewAction({ type: ADD_MOVIE, data })
		},

		addFavoriteMovie(data) {
			console.log('%cMARCIN :: ActionCreators.js :: data', 'background: #222; color: lime', data)
			appDispatcher.handleViewAction({ type: ADD_FAVORITE_MOVIE, data })
		},

		addWatchLaterMovie(data) {
			console.log('%cMARCIN :: ActionCreators.js :: data', 'background: #222; color: lime', data)
			appDispatcher.handleViewAction({ type: ADD_WATCH_LATER_MOVIE, data })
		},

		addHateMovie(data) {
			console.log('%cMARCIN :: ActionCreators.js :: data', 'background: #222; color: lime', data)
			appDispatcher.handleViewAction({ type: ADD_HATE_MOVIE, data })
		},

		removeFavoriteMovie(data) {
			console.log('%cMARCIN :: ActionCreators.js:23 :: data', 'background: #222; color: lime', data)
			appDispatcher.handleViewAction({ type: REMOVE_FAVORITE_MOVIE, data })
		},

		queryMovie(data) {
			appDispatcher.handleViewAction({ type: QUERY_MOVIE, data })
		}
	}
}
