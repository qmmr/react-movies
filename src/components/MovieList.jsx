import React from 'react'
import Search from './Search.jsx'
import context from '../context'
import Actions from '../actions/ActionCreators'

var movieStore = context.get('movieStore')

export default React.createClass({

	displayName: 'MovieList',

	getInitialState() {
		return {
			items: movieStore.getMovies(),
			query: '',
			foundMovie: null
		}
	},

	componentWillMount() {
		movieStore.addChangeListener(this._onMovieStoreChange)
	},

	searchQuery(query) {
		Actions.queryMovie(query)
	},

	getTitle(query) {
		this.setState({ query })
	},

	showFoundMovie() {
		return this.state.foundMovie ? <h1>{ this.state.foundMovie.Title }</h1> : null
	},

	getItems() {
		return this.state.items.map((item, idx) => {
			return <li key={ idx }>{ item }</li>
		})
	},

	addMovie(e) {
		e.preventDefault()

		var movie = {
			Title: "Horrible Bosses 2",
			Year: "2014",
			Rated: "R"
		}

		console.log('%cMARCIN :: MovieList.jsx:45 :: movie', 'background: #222; color: lime', movie)
		Actions.addMovie({ movie })
	},

	render() {
		return (
			<section className='movie-list col-md-12'>
				<ul>
					{ this.getItems() }
				</ul>
				<Search searchQuery={ this.searchQuery } />
				<button className="btn btn-primary" type="button" onClick={ this.addMovie }>Add movie</button>
				{ this.showFoundMovie() }
			</section>
		)
	},

	_onMovieStoreChange() {
		console.log('%cMARCIN :: MovieList.jsx:66 :: _onMovieStoreChange', 'background: #222; color: lime')
		this.setState({
			items: movieStore.getMovies(),
			foundMovie: movieStore.getFoundMovie()
		})
	}

})
