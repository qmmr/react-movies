import React from 'react'
import contextMixin from '../mixins/contextMixin'

export default React.createClass({

	displayName: 'Search',

	mixins: [ contextMixin ],

	getInitialState() {
		return {
			query: ''
		}
	},

	submitHandler(e) {
		e.preventDefault()

		console.log('submitHandler')
		console.log('%cMARCIN :: Search.jsx:44 :: submitHandler', 'background: #222; color: lime', this.state.query.trim())
		this.actions.queryMovie(this.state.query.trim())
	},

	render() {
		return (
			<section className="search">
				<form className='' role='search' onSubmit={ this.submitHandler }>
					<div className="input-group">
						<input
							ref='search'
							type='text'
							className='form-control'
							placeholder='Search for a movie...'
							onChange={ this._updateQuery }
							value={ this.state.query } />
						<span className='input-group-btn'>
							<button className='btn btn-primary' type='submit'>Search</button>
						</span>
					</div>
				</form>
			</section>
		)
	},

	_updateQuery(e) {
		e.preventDefault()
		console.log('MARCIN :: _updateQuery ::')
		this.setState({
			query: this.refs.search.getDOMNode().value
		})
	}

})
