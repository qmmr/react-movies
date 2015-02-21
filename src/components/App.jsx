import React from 'react'

import FavoriteMovies from './FavoriteMovies.jsx'
import MovieInfo from './MovieInfo.jsx'
import Search from './Search.jsx'

export default React.createClass({

	displayName: 'MoviesApp',

	render() {
		return (
			<main className='main col-md-12' role='main'>
				<h1>FLUX/React.js movie rating app</h1>
				<FavoriteMovies />
				<Search />
				<MovieInfo />
			</main>
		)
	}

})
