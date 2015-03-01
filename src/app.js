import React from 'react'
import App from './components/App.jsx'
import createActionCreators from './utils/createActionCreators'
import createFirebaseService from './utils/createFirebaseService'
import omdbService from './services/omdbService'
import AppDispatcher from './dispatcher/AppDispatcher'
import MoviesStore from './stores/MoviesStore'

var appDispatcher = new AppDispatcher()
var actions = createActionCreators(appDispatcher)
var favoriteMoviesFBSvc = createFirebaseService('https://favorite-movies.firebaseio.com/favorite-movies')
var viewContext = {
	moviesStore: new MoviesStore(appDispatcher, favoriteMoviesFBSvc, omdbService(actions)),
	actions
}

React.render(
	React.withContext(viewContext, function() {
		return React.createFactory(App)(null)
	}),
	document.querySelector('#container')
)
