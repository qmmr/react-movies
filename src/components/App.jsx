import React from 'react';
import MovieList from './MovieList.jsx'

export default React.createClass({

	displayName: 'App',

	render() {
		return (
			<section className="container">
				<h1>FLUX/React.js movie rating app</h1>
				<MovieList />
			</section>
		)
	}

})
