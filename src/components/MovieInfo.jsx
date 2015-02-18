import React from 'react'

export default React.createClass({

	displayName: 'MovieInfo',

	render() {
		return (
			this._getMovieInfo()
		)
	},

	_getMovieInfo() {
		var { Title, Year, imdbRating } = this.props.movie

		return (
			<article className="movie-info">
				<h1 className="movie-info__title">{ Title }</h1>
				<h2 className="movie-info__year">{ Year }</h2>
				<span className="movie-info__imdb-rating">{ imdbRating }</span>
				<button className="btn btn-success" type="button" onClick={ this.favoriteMovie }>
					<span className="glyphicon glyphicon-heart"></span>
				</button>
				<button className="btn btn-warning" type="button" onClick={ this.watchLaterMovie }>
					<span className="glyphicon glyphicon-star"></span>
				</button>
				<button className="btn btn-danger" type="button" onClick={ this.hateMovie }>
					<span className="glyphicon glyphicon-fire"></span>
				</button>
			</article>
		)
	}

})
