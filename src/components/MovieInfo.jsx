import React from 'react'
import context from '../context';

var moviesStore = context.get('moviesStore')

export default React.createClass({

	displayName: 'MovieInfo',

	getInitialState() {
		return {
			movie: moviesStore.getFoundMovie()
		}
	},

	render() {
		return (
			this._getMovieInfo()
		)
	},

	_getMovieInfo() {
		var { Title, Year, imdbRating } = this.state.movie

		return (
			<article className='panel panel-default movie-info'>
				<header className='panel-heading'>
					<h1 className='panel-title movie-info__title'>{ Title }</h1>
					<h2 className='movie-info__year'>{ Year }</h2>
				</header>
				<div className='panel-body'>
					<span className='movie-info__imdb-rating'>{ imdbRating }</span>
					<button className='btn btn-success' type='button' onClick={ this._favoriteMovie }>
						<span className='glyphicon glyphicon-heart'></span>
					</button>
					<button className='btn btn-warning' type='button' onClick={ this.watchLaterMovie }>
						<span className='glyphicon glyphicon-star'></span>
					</button>
					<button className='btn btn-danger' type='button' onClick={ this.hateMovie }>
						<span className='glyphicon glyphicon-fire'></span>
					</button>
				</div>
			</article>
		)
	},

	_favoriteMovie() {
		this.props.addFavoriteMovie()
	}

})
