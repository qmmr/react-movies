import React from 'react'
import contextMixin from '../mixins/contextMixin'

export default React.createClass({

	displayName: 'MovieInfo',

	mixins: [ contextMixin ],

	getInitialState() {
		return {
			movie: null,
			queryInProgress: false
		}
	},

	componentWillMount() {
		this.store.addChangeListener(this._onMoviesStoreChange)
	},

	render() {
		return this.state.movie ? this._getMovieInfo() : this._getLoader()
	},

	_getLoader() {
		let preloaderHTML = `
			<rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
				<animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
			</rect>
			<rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
				<animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
			</rect>
			<rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
				<animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
			</rect>`

		return this.state.queryInProgress ? (
			<div className="preloader">
				<h3>Searching for movie...</h3>
				<svg dangerouslySetInnerHTML={{ __html: preloaderHTML }}></svg>
			</div>
		) : null
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

	_onMoviesStoreChange() {
		this.setState({
			movie: this.store.getFoundMovie(),
			queryInProgress: this.store.isQueryInProgress()
		})
	}

})
