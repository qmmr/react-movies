import React from 'react'
import contextMixin from '../mixins/contextMixin'

export default React.createClass({

	displayName: 'MovieInfo',

	mixins: [ contextMixin ],

	getInitialState() {
		return {
			movie: null,
			loading: false
		}
	},

	componentWillMount() {
		this.store.addChangeListener(this._onMoviesStoreChange)
	},

	render() {
		return this.state.movie ? this._getMovieInfo() : this._getLoader()
	},

	_getLoader() {
		return this.state.loading ? <div className='alert alert-info'>Loading...</div> : null
	},

	_getMovieInfo() {
		let { Title, Director, Actors, Year, firebaseKey, imdbID, imdbRating, imdbVotes } = this.state.movie

		return (
			<article className='panel panel-default movie-info'>
				<h1 className='movie-info__title'>{ Title } - <span className='movie-info__year'>{ Year }</span></h1>
				<h2 className='movie-info__director'>Director: { Director }</h2>
				<div className='movie-info__body'>
					<p className='alert alert-warning movie-info__imdb-rating'>IMDB rating { imdbRating } / votes { imdbVotes }</p>
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">Actors</h3>
						</div>
						<div className="panel-body">
						{ Actors }
						</div>
					</div>
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
		this.setState({
			movie: this.store.getFoundMovie(),
			loading: this.store.isLoading()
		})
	}

})
