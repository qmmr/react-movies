import Firebase from 'firebase'
import { ROOT_FIREBASE_URL, FAVORITE_MOVIES } from '../constants/constants'
import { CHILD_ADDED } from '../constants/firebaseTypes'

function firebaseService(actions) {
	var rootFirebaseRef = new Firebase(ROOT_FIREBASE_URL)
	var favoriteMoviesFirebaseRef = rootFirebaseRef.child(FAVORITE_MOVIES)

	return {

		getRootFirebaseRef() {
			return rootFirebaseRef
		},

		getFavoriteMoviesFirebaseRef() {
			return favoriteMoviesFirebaseRef
		},

		addToFavoriteMovies(movie) {
			return favoriteMoviesFirebaseRef.push(movie, (err) => {
				if (err) {
					console.error(err.message)
				}
			})
		},

		removeFromFavoriteMovies(key) {
			let movieRef = favoriteMoviesFirebaseRef.child(key)
			let errorHandler = (err) => {
				if (err) {
					console.error(err)
				} else {
					console.log(`movie ${ key } was removed`)
					actions.childRemoved(key)
				}
			}

			movieRef.remove(errorHandler)
		},

		on(type) {
			switch(type) {
				case CHILD_ADDED:
					favoriteMoviesFirebaseRef.on(CHILD_ADDED, function childAdded(childSnapshot, prevChildKey) {
						let movie = childSnapshot.val()
						movie.firebaseKey = childSnapshot.key()
						// TODO: how to postpone the actions while dealing with firebase?
						setTimeout(() => actions.childAdded(movie), 0)
					})
					break;
			}
		}

	}
}

export default firebaseService
	// _listenToFavoriteMoviesSvc() {

	// }

	// _removeFromFavoriteMovies(key) {
	// 	this._favoriteMovies = this._favoriteMovies.filter((movie) => movie.firebaseKey !== key)
	// 	// FIXME: should send another action to the system?
	// 	this.emitChange()
	// }
