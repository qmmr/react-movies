import { Dispatcher } from 'flux'

const VIEW_ACTION = 'VIEW_ACTION'
const SERVER_ACTION = 'SERVER_ACTION'

export default class AppDispatcher extends Dispatcher {
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
