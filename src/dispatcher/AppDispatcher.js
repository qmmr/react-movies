import { Dispatcher } from 'flux'

const VIEW_ACTION = 'VIEW_ACTION'

export default class AppDispatcher extends Dispatcher {
	constructor() {
		super()
	}

	handleViewAction(action) {
		this.dispatch({ source: VIEW_ACTION, action })
	}
}
