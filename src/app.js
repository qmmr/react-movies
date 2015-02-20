import React from 'react'
import App from './components/App.jsx'
import createActionCreators from './utils/createActionCreators'
import AppDispatcher from './dispatcher/AppDispatcher'
import MoviesStore from './stores/MoviesStore'

var appDispatcher = new AppDispatcher()
var actions = createActionCreators(appDispatcher)
var viewContext = {
	moviesStore: new MoviesStore(appDispatcher),
	actions
}

React.render(
	React.withContext(viewContext, function() {
		return React.createFactory(App)(null)
	}),
	document.querySelector('#container')
)
