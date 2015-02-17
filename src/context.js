import iniettore from 'iniettore'
import { VALUE, LAZY, PROVIDER, SINGLETON, CONSTRUCTOR } from 'iniettore'

import { ADD_MOVIE, REMOVE_MOVIE } from './constants/actionTypes'
import { CHANGE_EVENT } from './constants/routingTypes'

import AppDispatcher from './dispatcher/AppDispatcher'
import MovieStore from './stores/MovieStore'

var mainContext = iniettore.create(function (map) {
	// map('answer').to(42).as(VALUE)
	// map('question').to(UltimateQuestion).as(LAZY, SINGLETON, CONSTRUCTOR).injecting('answer')
	map('appDispatcher').to(AppDispatcher).as(LAZY, SINGLETON, CONSTRUCTOR)
	map('movieStore').to(MovieStore).as(LAZY, SINGLETON, CONSTRUCTOR)
})

var appDispatcher = mainContext.get('appDispatcher')
var movieStore = mainContext.get('movieStore')

appDispatcher.register(function({ action: { paylod: action } }) {
	console.log('appDispatcher.register')
	switch(type) {
		case ADD_MOVIE:
			movieStore.prevStep(action.data)
			break
		case REMOVE_MOVIE:
			movieStore.nextStep(action.data)
			break
	}

	movieStore.emitChange()
})

export default mainContext
