import React from 'react'
import contextMixin from '../mixins/contextMixin'

export default React.createClass({

	displayName: 'MovieInfo',

	mixins: [ contextMixin ],

	getInitialState() {
		return {
			movie: null
		}
	},

	componentWillMount() {
		this.store.addChangeListener(this._onMoviesStoreChange)
	},

	render() {
		return this.state.movie ? this._getMovieInfo() : null
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
					<h3 className='movie-info__imdb-rating'>{ imdbRating }</h3>

					{ this._getButtonsGroup() }

				</div>
			</article>
		)
	},

	_getButtonsGroup() {
		return (
			<div className='btn-group btn-group-justified' role='group' aria-label='buttons'>
				<div className='btn-group' role='group'>
					<button type='button' className='btn btn-success' onClick={ this._addToFavoriteMovies }>
						<span className='glyphicon glyphicon-heart'></span>
					</button>
				</div>
			</div>
		)
	},

	_addToFavoriteMovies(e) {
		e.preventDefault()
		this.actions.addFavoriteMovie(this.state.movie)
	},

	_addToWatchLaterMovies(e) {
		e.preventDefault()
		console.log('MARCIN :: _addToWatchLaterMovies ::')
		this.actions.addWatchLaterMovie(this.state.movie)
	},

	_addToHateMovies(e) {
		e.preventDefault()
		console.log('MARCIN :: _addToHateMovies ::')
		this.actions.addHateMovie(this.state.movie)
	},

	_onMoviesStoreChange() {
		this.setState({ movie: this.store.getFoundMovie() })
	}

})
