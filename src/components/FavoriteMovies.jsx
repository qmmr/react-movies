import React from 'react'
import contextMixin from '../mixins/contextMixin'

export default React.createClass({

	displayName: 'FavoriteMovies',

	mixins: [ contextMixin ],

	getInitialState() {
		return {
			movies: this.store.getFavoriteMovies()
		}
	},

	componentWillMount() {
		this.store.addChangeListener(this._onMoviesStoreChange)
	},

	render() {
		return (
			<div className='panel panel-default'>

				<header className='panel-heading'>
					<h1>Favorite Movies</h1>
				</header>

				<table className='table table-hover table-striped'>
					<thead>
						<tr>
							<th>Title</th>
							<th>Year</th>
							<th>Director</th>
							<th>Actors</th>
							<th>imdbRating</th>
							<th>imdbVotes</th>
							<th className='text-center'><span className='glyphicon glyphicon-remove'></span></th>
						</tr>
					</thead>
					<tbody>
						{ this._getTableRows() }
					</tbody>
				</table>

			</div>
		)
	},

	_getTableRows() {
		return (
			this.state.movies.map((movie, idx) => {
				let { Title, Director, Actors, Year, firebaseKey, imdbID, imdbRating, imdbVotes } = movie

				return (
					<tr key={ idx }>
						<td><a href={ 'http://www.imdb.com/title/' + imdbID } target='_blank'>{ Title }</a></td>
						<td>{ Year }</td>
						<td>{ Director }</td>
						<td>{ Actors }</td>
						<td>{ imdbRating }</td>
						<td>{ imdbVotes }</td>
						<td className='text-center'>{ this._createRemoveButton(firebaseKey) }</td>
					</tr>
				)
			})
		)
	},

	_createRemoveButton(key) {
		var removeFromFavoriteMovies = () => this.actions.removeFavoriteMovie(key)

		return (
			<button className='btn btn-danger btn-xs' type='button' onClick={ removeFromFavoriteMovies }>
				<span className='glyphicon glyphicon-remove'></span>
			</button>
		)
	},

	_onMoviesStoreChange() {
		this.setState({ movies: this.store.getFavoriteMovies() })
	}

})
