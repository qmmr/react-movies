import MoviesStore from '../../../src/stores/MoviesStore'
import AppDispatcher from '../../../src/dispatcher/AppDispatcher'
import getMovieStub from '../../utils/getMovieStub'

const MOVIE = getMovieStub()

var dispatcher = new AppDispatcher()
var firebaseSvc = {
	on: sinon.spy()
}
var moviesStore

describe('Given an instance of the MoviesStore', function() {
	beforeEach(function() {
		moviesStore = new MoviesStore(dispatcher, firebaseSvc)
	})

	it('should be an instance of MoviesStore', function() {
		expect(moviesStore).to.be.an.instanceof(MoviesStore)
	})

	describe('#getFoundMovie', function() {
		it('should have a method getFoundMovie', function() {
			expect(moviesStore.getFoundMovie).to.be.a.function
		})

		it('should return null', function() {
			expect(moviesStore.getFoundMovie()).to.be.null
		})
	})

	describe('#getFavoriteMovies', function() {
		it('should have a method getFavoriteMovies', function() {
			expect(moviesStore.getFavoriteMovies).to.be.a.function
		})

		it('should return an empty array', function() {
			expect(moviesStore.getFavoriteMovies())
				.to.be.empty
				.and.to.be.an.array
		})
	})

	describe('and pending ADD_FAVORITE_MOVIE request', function() {
		before(function() {
			var action = { type: 'ADD_FAVORITE_MOVIE', MOVIE }
			moviesStore = new MoviesStore(dispatcher, firebaseSvc)
			moviesStore._foundMovie = MOVIE
			dispatcher.handleViewAction({ source: 'VIEW_ACTION', action })
		})

		it('should remove the movie from foundMovie property', function() {
			expect(moviesStore.getFoundMovie()).to.be.null
		})
	})
})
