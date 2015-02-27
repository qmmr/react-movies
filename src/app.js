import React from 'react'
import App from './components/App.jsx'
import createActionCreators from './actions/createActionCreators'
import getFirebaseService from './services/firebaseService'
import getOMDBService from './services/omdbService'
import AppDispatcher from './dispatcher/AppDispatcher'
import MoviesStore from './stores/MoviesStore'

var appDispatcher = new AppDispatcher()
var actions = createActionCreators(appDispatcher)
var firebaseService = getFirebaseService(actions)
var omdbService = getOMDBService(actions)
var moviesStore = new MoviesStore(appDispatcher, firebaseService, omdbService)

React.render(
	React.withContext({ moviesStore, actions }, function() {
		return React.createFactory(App)(null)
	}),
	document.querySelector('#container')
)
