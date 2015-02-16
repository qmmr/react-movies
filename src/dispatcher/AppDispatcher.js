import Dispatcher from 'flux/lib/Dispatcher'
import { SERVER_ACTION, VIEW_ACTION } from '../constants/sourceTypes'

class AppDispatcher extends Dispatcher {
	constructor() {
		super()
	}

	handleViewAction(action) {
		this.dispatch({ source: VIEW_ACTION, action })
	}

	handleServerAction(action) {
		this.dispatch({ source: SERVER_ACTION, action })
	}
}

export default AppDispatcher
