import React from 'react'

import context from '../context'
import Actions from '../actions/ActionCreators'

import Search from './Search.jsx'
import MovieInfo from './MovieInfo.jsx'

var movieStore = context.get('movieStore')

export default React.createClass({

	displayName: 'MovieList',

	getInitialState() {
		return {
			movies: [],
			query: '',
			movie: null
		}
	},

	componentWillMount() {
		movieStore.addChangeListener(this._onMovieStoreChange)
	},

	searchQuery(query) {
		Actions.queryMovie(query)
	},

	getTitle(query) {
		this.setState({ query })
	},

	showFoundMovie() {
		return this.state.movie ? <h1>{ this.state.movie.Title }</h1> : null
	},

	getItems() {
		return this.state.movies.map((item, idx) => {
			return <li key={ idx }>{ item }</li>
		})
	},

	addMovie(e) {
		e.preventDefault()

		Actions.addMovie({ movie })
	},

	render() {
		return (
			<section className='movie-list col-md-12'>
				<ul>
					{ this.getItems() }
				</ul>
				<Search searchQuery={ this.searchQuery } />

				{ this.showFoundMovie() && <MovieInfo movie={ this.state.movie } /> }
			</section>
		)
	},

	_onMovieStoreChange() {
		console.log('%cMARCIN :: MovieList.jsx:66 :: _onMovieStoreChange', 'background: #222; color: lime')
		this.setState({
			movies: movieStore.getMovies(),
			movie: movieStore.getFoundMovie()
		})
	}

})
