import React from 'react'

export default React.createClass({

	displayName: 'MovieList',

	getInitialState() {
		return {
			items: [ 'Gone Girl', 'Nightcrawler', 'Fury' ]
		}
	},

	getItems() {
		return this.state.items.map((item, idx) => {
			return <li key={ idx }>{ item }</li>
		})
	},

	render() {
		return (
			<section>
				<ul>
					{ this.getItems() }
				</ul>
			</section>
		)
	}

})
