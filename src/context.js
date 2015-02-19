import iniettore from 'iniettore'
import { VALUE, LAZY, PROVIDER, SINGLETON, CONSTRUCTOR } from 'iniettore'

import {
	ADD_MOVIE,
	ADD_FAVORITE_MOVIE,
	REMOVE_MOVIE,
	QUERY_MOVIE
} from './constants/actionTypes'

import AppDispatcher from './dispatcher/AppDispatcher'
import MoviesStore from './stores/MoviesStore'
import FavoriteMoviesStore from './stores/FavoriteMoviesStore'

var mainContext = iniettore.create(function (map) {
	map('appDispatcher').to(AppDispatcher).as(LAZY, SINGLETON, CONSTRUCTOR)
	map('moviesStore').to(MoviesStore).as(LAZY, SINGLETON, CONSTRUCTOR)
	map('favoriteMoviesStore').to(FavoriteMoviesStore).as(LAZY, SINGLETON, CONSTRUCTOR)
})

var appDispatcher = mainContext.get('appDispatcher')
var moviesStore = mainContext.get('moviesStore')
var favoriteMoviesStore = mainContext.get('favoriteMoviesStore')

appDispatcher.register(function({ source, action: { type, data } }) {
	console.log('appDispatcher.register', source, type, data)

	switch(type) {
		case ADD_MOVIE:
			moviesStore.addMovie(data)
			break
		case ADD_FAVORITE_MOVIE:
			favoriteMoviesStore.addMovie(data)
			break
		case REMOVE_MOVIE:
			moviesStore.removeMovie(data)
			break
		case QUERY_MOVIE:
			moviesStore.queryMovie(data)
			break
	}

	return true
})

export default mainContext
