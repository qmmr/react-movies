import Firebase from 'firebase'
import { ROOT_FIREBASE_URL, FAVORITE_MOVIES } from '../constants/constants'
import { CHILD_ADDED, CHILD_REMOVED } from '../constants/firebaseTypes'

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
			favoriteMoviesFirebaseRef.push(movie)
		},

		removeFromFavoriteMovies(key) {
			let movieRef = favoriteMoviesFirebaseRef.child(key)

			movieRef.remove()
		},

		on(type) {
			switch(type) {
				case CHILD_ADDED:
					favoriteMoviesFirebaseRef.on(CHILD_ADDED, (childSnapshot, prevChildKey) => {
						let movie = childSnapshot.val()
						movie.firebaseKey = childSnapshot.key()
						// TODO: how to postpone the actions while dealing with firebase?
						setTimeout(() => actions.childAdded(movie), 0)
					})
					break;
				case CHILD_REMOVED:
					favoriteMoviesFirebaseRef.on(CHILD_REMOVED, (oldChildSnapshot) => {
						setTimeout(() => actions.childRemoved(oldChildSnapshot.key()), 0)
					})
					break;
			}
		}

	}
}

export default firebaseService
