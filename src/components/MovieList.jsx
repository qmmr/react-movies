import React from 'react'

import context from '../context'
import Actions from '../actions/ActionCreators'

import Search from './Search.jsx'
import MovieInfo from './MovieInfo.jsx'
import FavoriteMovies from './FavoriteMovies.jsx'

var moviesStore = context.get('moviesStore')

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
		moviesStore.addChangeListener(this._onMoviesStoreChange)
		this.firebaseRef = new Firebase('https://favorite-movies.firebaseio.com/movies')
		this.firebaseRef.on('child_added', (dataSnapshot) => {
			console.log('child_added', dataSnapshot.val())
			this.movies.push(dataSnapshot.val())
			this.setState({ movies: this.movies })
		})
	},

	addFavoriteMovie(movie) {
		console.log('MARCIN :: addFavoriteMovie ::', this.state.movie)
		Actions.addFavoriteMovie(this.state.movie)
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
				<FavoriteMovies />
				<Search searchQuery={ this.searchQuery } />

				{ this.showFoundMovie() && <MovieInfo addFavoriteMovie={ this.addFavoriteMovie } /> }
			</section>
		)
	},

	_onMoviesStoreChange() {
		let movie = moviesStore.getFoundMovie()
		let movies = moviesStore.getMovies()

		console.log('%cMARCIN :: MovieList.jsx:66 :: _onMovieStoreChange::movie', 'background: #222; color: lime', movie)
		// set state
		this.setState({ movies, movie })
		// and push found movie to firebase
		// if (movie) {
		// 	this.firebaseRef.push(movie)
		// }
	}

})
