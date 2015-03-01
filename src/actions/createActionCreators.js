import {
	ADD_MOVIE,
	ADD_FAVORITE_MOVIE,
	ADD_WATCH_LATER_MOVIE,
	ADD_HATE_MOVIE,
	REMOVE_FAVORITE_MOVIE,
	QUERY_MOVIE,
	MOVIE_DATA,
	NO_MOVIE_DATA,
	OMDB_ERROR
} from '../constants/actionTypes'

import { CHILD_ADDED, CHILD_REMOVED } from '../constants/firebaseTypes'

export default function createActionCreators(appDispatcher) {
	return {
		addFavoriteMovie(data) {
			appDispatcher.handleViewAction({ type: ADD_FAVORITE_MOVIE, data })
		},

		addWatchLaterMovie(data) {
			appDispatcher.handleViewAction({ type: ADD_WATCH_LATER_MOVIE, data })
		},

		addHateMovie(data) {
			appDispatcher.handleViewAction({ type: ADD_HATE_MOVIE, data })
		},

		removeFavoriteMovie(data) {
			appDispatcher.handleViewAction({ type: REMOVE_FAVORITE_MOVIE, data })
		},

		queryMovie(data) {
			appDispatcher.handleViewAction({ type: QUERY_MOVIE, data })
		},

		foundMovie(data) {
			appDispatcher.handleServerAction({ type: MOVIE_DATA, data })
		},

		notFoundMovie(data) {
			appDispatcher.handleServerAction({ type: NO_MOVIE_DATA, data })
		},

		handleOMDBError(data) {
			appDispatcher.handleServerAction({ type: OMDB_ERROR, data })
		},

		childAdded(data) {
			appDispatcher.handleServerAction({ type: CHILD_ADDED, data })
		},

		childRemoved(data) {
			appDispatcher.handleServerAction({ type: CHILD_REMOVED, data })
		}
	}
}
