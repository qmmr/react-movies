'use strict'

import React from 'react'

import context from '../context'
import Actions from '../actions/ActionCreators'

var favoriteMoviesStore = context.get('favoriteMoviesStore')

export default React.createClass({

	displayName: 'FavoriteMovies',

	getInitialState() {
		this.movies = []

		return {
			movies: [
				{ Title: 'Foo', Year: '2015' },
				{ Title: 'Bar', Year: '2015' }
			]
		}
	},

	componentWillMount() {
		favoriteMoviesStore.addChangeListener(this._onFavoriteMoviesStoreChange)
		this.firebaseRef = new Firebase('https://favorite-movies.firebaseio.com/favorite-movies')
		this.firebaseRef.on('child_added', (dataSnapshot) => {
			console.log('child_added', dataSnapshot.val())
			this.movies.push(dataSnapshot.val())
			this.setState({ movies: this.movies })
		})
	},

	render() {
		return (
			<div className='panel panel-default'>

				<header className='panel-heading'>
					<h1>Favorite Movies</h1>
				</header>
				<div className='panel-body'>
					<p>Films you love</p>
				</div>

				<ul className='list-group'>
					{ this._getListItems() }
				</ul>

			</div>
		)
	},

	_getListItems() {
		return this.state.movies.map(({ Title }, idx) => {
			return <li key={ idx } className='list-group-item'>{ Title }</li>
		})
	},

	_onFavoriteMoviesStoreChange() {
		console.log('MARCIN :: _onFavoriteMoviesStoreChange ::', favoriteMoviesStore.getMovies())
	}

})
