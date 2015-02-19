import React from 'react'

import context from '../context'
import Actions from '../actions/ActionCreators'

import Search from './Search.jsx'
import MovieInfo from './MovieInfo.jsx'

var movieStore = context.get('movieStore')

export default React.createClass({

	displayName: 'MovieList',

	getInitialState() {
		this.movies = []

		return {
			movies: [],
			query: '',
			movie: null
		}
	},

	componentWillMount() {
		movieStore.addChangeListener(this._onMovieStoreChange)
		this.firebaseRef = new Firebase('https://favorite-movies.firebaseio.com/movies')
		this.firebaseRef.on('child_added', (dataSnapshot) => {
			console.log('child_added', dataSnapshot.val())
			this.movies.push(dataSnapshot.val())
			this.setState({ movies: this.movies })
		})
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
		let movie = movieStore.getFoundMovie()
		let movies = movieStore.getMovies()

		console.log('%cMARCIN :: MovieList.jsx:66 :: _onMovieStoreChange::movie', 'background: #222; color: lime', movie)
		// set state
		this.setState({ movies, movie })
		// and push found movie to firebase
		if (movie) {
			this.firebaseRef.push(movie)
		}
	}

})
