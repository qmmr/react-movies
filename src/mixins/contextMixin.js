import React from 'react'

export default {

	contextTypes: {
		moviesStore: React.PropTypes.object.isRequired,
		actions: React.PropTypes.object.isRequired
	},

	getInitialState() {
		this.actions = this.context.actions
		delete this.context.actions
		this.store = this.context.moviesStore
		delete this.context.moviesStore

		return {}
	}

}
