import React from 'react'
import Search from './Search.jsx'
import context from '../context'

var movieStore = context.get('movieStore')

export default React.createClass({

	displayName: 'MovieList',

	getInitialState() {
		return {
			items: movieStore.getMovies(),
			query: ''
		}
	},

	getTitle(query) {
		this.setState({ query })
	},

	showQuery() {
		return this.state.query ? <h1>{ this.state.query }</h1> : null
	},

	getItems() {
		return this.state.items.map((item, idx) => {
			return <li key={ idx }>{ item }</li>
		})
	},

	render() {
		return (
			<section className='movie-list col-md-12'>
				<ul>
					{ this.getItems() }
				</ul>
				<Search getTitle={ this.getTitle } />
				{ this.showQuery() }
			</section>
		)
	}

})
