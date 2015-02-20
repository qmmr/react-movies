import React from 'react';

import Search from './Search.jsx'
import MovieInfo from './MovieInfo.jsx'
import FavoriteMovies from './FavoriteMovies.jsx'

export default React.createClass({

	displayName: 'MoviesApp',

	contextTypes: {
		moviesStore: React.PropTypes.object.isRequired,
		actions: React.PropTypes.object.isRequired
	},

	getInitialState() {
		this.movies = []

		return {
			movie: null
		}
	},

	componentWillMount() {
		// moviesStore.addChangeListener(this._onMoviesStoreChange)
		// this.firebaseRef = new Firebase('https://favorite-movies.firebaseio.com/movies')
		// this.firebaseRef.on('child_added', (dataSnapshot) => {
		// 	console.log('child_added', dataSnapshot.val())
		// 	this.movies.push(dataSnapshot.val())
		// 	this.setState({ movies: this.movies })
		// })
	},

	render() {
		return (
			<main className='main col-md-12' role='main'>
				<h1>FLUX/React.js movie rating app</h1>
				<FavoriteMovies />
				<Search />
				<MovieInfo />
			</main>
		)
	},

	// private methods

	_onMoviesStoreChange() {
		let movie = this.context.moviesStore.getFoundMovie()

		console.log('%cMARCIN :: MovieList.jsx:66', 'background: #222; color: lime', movie)
		// set state
		this.setState({ movie })
		// and push found movie to firebase
		// if (movie) {
		// 	this.firebaseRef.push(movie)
		// }
	}

})
