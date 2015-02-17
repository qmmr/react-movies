import React from 'react'
import context from '../context'
import Actions from '../actions/ActionCreators'

var movieStore = context.get('movieStore')

export default React.createClass({

	displayName: 'Search',

	submitHandler(e) {
		e.preventDefault()
		let query = this.refs.search.getDOMNode().value.trim()

		Actions.queryMovie(query)
		this.props.getTitle(query)
	},

	render() {
		return (
			<form className='form-inline' role='search' onSubmit={ this.submitHandler }>
				<div className='form-group'>
					<input ref='search' type='text' className='form-control' placeholder='Search' />
				</div>
				<button type='submit' className='btn btn-default'>Submit</button>
			</form>
		)
	}

})
