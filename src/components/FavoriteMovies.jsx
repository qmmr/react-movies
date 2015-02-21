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

				<div className='panel-body'>
					{ this._getList() }
				</div>

			</div>
		)
	},

	_getSpinner() {
		return <span>Loading...</span>
	},

	_getList() {
		return (
			<ul className='list-group'>
				{ this._getListItems() }
			</ul>
		)
	},

	_getListItems() {
		let items = this.state.movies.map(({ Title, Year, firebaseKey: key }, idx) => {

			return (
				<li key={ idx } className='list-group-item'>
					{ Title }:{ Year }
					{ this._createRemoveButton(key) }
				</li>
			)
		})

		return items
	},

	_createRemoveButton(key) {
		var removeFromFavoriteMovies = () => this.actions.removeFavoriteMovie(key)

		return (
			<button className='btn btn-danger btn-xs pull-right' type='button' onClick={ removeFromFavoriteMovies }>
				<span className='glyphicon glyphicon-remove'></span>
			</button>
		)
	},

	_onMoviesStoreChange() {
		this.setState({ movies: this.store.getFavoriteMovies() })
	}

})
