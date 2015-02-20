import React from 'react'

export default React.createClass({

	displayName: 'MovieInfo',

	contextTypes: {
		moviesStore: React.PropTypes.object.isRequired,
		actions: React.PropTypes.object.isRequired
	},

	getInitialState() {
		return {
			movie: null
		}
	},

	componentWillMount() {
		this.context.moviesStore.addChangeListener(this._onMoviesStoreChange)
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
				<div className='btn-group' role='group'>
					<button type='button' className='btn btn-warning' onClick={ this._addToWatchLaterMovies }>
						<span className='glyphicon glyphicon-star'></span>
					</button>
				</div>
				<div className='btn-group' role='group'>
					<button type='button' className='btn btn-danger' onClick={ this._addToHateMovies }>
						<span className='glyphicon glyphicon-fire'></span>
					</button>
				</div>
			</div>
		)
	},

	_addToFavoriteMovies(e) {
		e.preventDefault()
		debugger
		console.log('MARCIN :: _addToFavoriteMovies ::')
		this.context.actions.addFavoriteMovie(this.state.movie)
		// this.setState({ movie: null })
	},

	_addToWatchLaterMovies(e) {
		e.preventDefault()
		console.log('MARCIN :: _addToWatchLaterMovies ::')
	},

	_addToHateMovies(e) {
		e.preventDefault()
		console.log('MARCIN :: _addToHateMovies ::')
	},

	_onMoviesStoreChange() {
		let movie = this.context.moviesStore.getFoundMovie()
		console.log('MARCIN :: MovieInfo#_onMoviesStoreChange ::', movie)
		this.setState({ movie })
	}

})
