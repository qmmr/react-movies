import React from 'react'
import contextMixin from '../mixins/contextMixin'

export default React.createClass({

	displayName: 'Search',

	mixins: [ contextMixin ],

	getInitialState() {
		return {
			query: '',
			loading: this.store.isLoading()
		}
	},

	componentWillMount() {
		this.store.addChangeListener(this._onMoviesStoreChange)
	},

	submitHandler(e) {
		e.preventDefault()

		if (!this.state.loading) {
			this.actions.queryMovie(this.state.query.trim())
			this.setState({ query: '' })
		}
	},

	render() {
		return (
			<section className="search">
				<form role='search' onSubmit={ this.submitHandler }>
					<div className="input-group">
						<input
							ref='search'
							type='text'
							className='form-control'
							placeholder='Search for a movie...'
							disabled={ this.state.loading && 'disabled' }
							onChange={ this._updateQuery }
							value={ this.state.query } />
						<span className='input-group-btn'>
							<button
								className='btn btn-primary'
								disabled={ this.state.loading && 'disabled' }
								type='submit'>
								Search
							</button>
						</span>
					</div>
				</form>
			</section>
		)
	},

	_updateQuery(e) {
		e.preventDefault()

		this.setState({ query: this.refs.search.getDOMNode().value })
	},

	_onMoviesStoreChange() {
		this.setState({ loading: this.store.isLoading() })
	}

})
