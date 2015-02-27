import MoviesStore from '../../../src/stores/MoviesStore'
import { VIEW_ACTION, SERVER_ACTION } from '../../../src/constants/sourceTypes'
import {
	QUERY_MOVIE,
	ADD_FAVORITE_MOVIE,
	REMOVE_FAVORITE_MOVIE,
	MOVIE_DATA,
	NO_MOVIE_DATA
} from '../../../src/constants/actionTypes'
import { CHILD_ADDED, CHILD_REMOVED } from '../../../src/constants/firebaseTypes'
import getMovieStub from '../../utils/getMovieStub'
import objectAssign from 'object-assign'

const MOVIE = getMovieStub()
const FAKE_MOVIE = { firebaseKey: 'fake_key' }
const MOVIE_REF_KEY = '-JiiDpEbWl4bQiWu7MpF'
const NOT_FOUND_RESP = { Response: 'False', Error: 'Movie not found!' }
const REQUEST_MOCK = {
	method: 'GET',
	url: 'http://www.omdbapi.com/?t=filemon%20i%20bonifacy&plot=short&r=json'
}

var createPayload = (source, type, data) => {
	return {
		source,
		action: {
			type,
			data
		}
	}
}

var dispatcher = {
	register: sinon.spy(),
	handleViewAction: sinon.stub(),
	handleServerAction: sinon.stub()
}

var firebaseService = {
	on: sinon.spy(),
	addToFavoriteMovies: sinon.stub(),
	removeFromFavoriteMovies: sinon.spy(),
	listenToChildAdded: sinon.spy()
}

var omdbSvc = {
	queryMovie: sinon.stub()
}

describe('Given an instance of the MoviesStore', function() {

	describe('when invoking #getFoundMovie', function() {
		describe('and no actions have been dispatched', function() {
			var moviesStore

			before(function() {
				moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
			})

			it('should return null', function() {
				expect(moviesStore.getFoundMovie()).to.be.null
			})
		})

		describe('and the "MOVIE_DATA" have been dispatched', function() {
			var moviesStore

			before(function() {
				var payload = createPayload(SERVER_ACTION, MOVIE_DATA, MOVIE)

				moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
				moviesStore.handleAction(payload)
			})

			it('should matche the found movie data', function() {
				expect(moviesStore.getFoundMovie()).to.deep.equal(MOVIE)
			})
		})

		describe('and the "NO_MOVIE_DATA" have been dispatched', function() {
			var moviesStore

			before(function() {
				var payload = createPayload(SERVER_ACTION, NO_MOVIE_DATA, NOT_FOUND_RESP)

				moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
				moviesStore.handleAction(payload)
			})

			it('should matche the found movie data', function() {
				expect(moviesStore.getFoundMovie()).to.deep.equal(NOT_FOUND_RESP)
			})
		})
	})

	describe('when invoking #getFavoriteMovies', function() {
		describe('and no actions have been dispatched', function() {
			var moviesStore

			before(function() {
				moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
			})

			it('should return an empty array', function() {
				expect(moviesStore.getFavoriteMovies())
					.to.be.empty
					.and.to.be.an.array
			})
		})
	})

	describe('when invoking #hasFoundMovie', function() {
		var moviesStore

		beforeEach(function() {
			moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
		})

		it('should return true if the movie was found', function() {
			moviesStore._foundMovie = MOVIE
			expect(moviesStore.hasFoundMovie()).to.be.true
		})

		it('should return false if the movie was NOT found', function() {
			expect(moviesStore.hasFoundMovie()).to.be.false
		})
	})

	describe('when a "MOVIE_DATA" is dispatched', function() {
		var moviesStore

		before(function() {
			var payload = createPayload(SERVER_ACTION, MOVIE_DATA, MOVIE)

			moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
			sinon.spy(moviesStore, 'emitChange')
			moviesStore.handleAction(payload)
		})

		after(function() {
			moviesStore.emitChange.restore()
		})

		it('should set the movie to foundMovie key', function() {
			expect(moviesStore.emitChange).to.be.calledOnce
			expect(moviesStore.getFoundMovie()).to.deep.equal(MOVIE)
		})
	})

	describe('when "NO_MOVIE_DATA" is dispatched', function() {
		var moviesStore

		before(function() {
			var payload = createPayload(SERVER_ACTION, NO_MOVIE_DATA, NOT_FOUND_RESP)

			moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
			sinon.spy(moviesStore, 'emitChange')
			moviesStore.handleAction(payload)
		})

		after(function() {
			moviesStore.emitChange.restore()
		})

		it('should assign "NOT_FOUND_RESP" to foundMovie key', function() {
			expect(moviesStore.emitChange).to.be.calledOnce
			expect(moviesStore.getFoundMovie()).to.deep.equal(NOT_FOUND_RESP)
		})
	})

	describe('when a "QUERY_MOVIE" is dispatched', function() {
		var moviesStore

		before(function() {
			var payload = createPayload(VIEW_ACTION, QUERY_MOVIE, 'Filemon i Bonifacy')

			omdbSvc.queryMovie.withArgs('Filemon i Bonifacy').returns(REQUEST_MOCK)
			moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
			sinon.spy(moviesStore, 'emitChange')
			moviesStore.handleAction(payload)
		})

		after(function() {
			moviesStore.emitChange.restore()
		})

		it('should call the omdbSvc#queryMovie with the expected title', function() {
			expect(omdbSvc.queryMovie)
				.to.be.calledWith('Filemon i Bonifacy')
				.and.to.be.calledOnce
			expect(moviesStore.emitChange).to.be.called
			expect(moviesStore.getLastRequest()).to.deep.equal(REQUEST_MOCK)
		})
	})

	describe('when a "ADD_FAVORITE_MOVIE" is dispatched', function() {
		var moviesStore

		before(function() {
			var payload = createPayload(VIEW_ACTION, ADD_FAVORITE_MOVIE, MOVIE)

			moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
			sinon.spy(moviesStore, 'emitChange')
			moviesStore.handleAction(payload)
		})

		after(function() {
			moviesStore.emitChange.restore()
		})

		it('should call the firebaseService.addToFavoriteMovies', function() {
			expect(firebaseService.addToFavoriteMovies)
				.to.be.calledOnce
				.and.to.be.calledWithExactly(MOVIE)
		})

		it('should remove the movie from foundMovie property', function() {
			expect(moviesStore.getFoundMovie()).to.be.null
		})

		it('should emit change event', function() {
			expect(moviesStore.emitChange).to.be.calledOnce
		})
	})

	describe('when a "REMOVE_FAVORITE_MOVIE" is dispatched', function() {
		var moviesStore

		before(function() {
			var payload = createPayload(VIEW_ACTION, REMOVE_FAVORITE_MOVIE, MOVIE_REF_KEY)

			moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
			sinon.spy(moviesStore, 'emitChange')
			moviesStore.handleAction(payload)
		})

		after(function() {
			moviesStore.emitChange.restore()
		})

		it('should call removeFromFavoriteMovies method on firebaseService', function() {
			expect(firebaseService.removeFromFavoriteMovies)
				.to.be.calledOnce
				.and.to.be.calledWith(MOVIE_REF_KEY)
			expect(moviesStore.emitChange).to.not.be.called
		})
	})

	describe('when a "CHILD_ADDED" is dispatched', function() {
		var moviesStore, payload

		before(function() {
			payload = createPayload(SERVER_ACTION, CHILD_ADDED, MOVIE)

			moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
			sinon.spy(moviesStore, 'emitChange')
		})

		after(function() {
			moviesStore.emitChange.restore()
		})

		it('should add the movie to favoriteMovies array', function() {
			expect(moviesStore.getFavoriteMovies()).to.have.length(0)
			moviesStore.handleAction(payload)
			expect(moviesStore.getFavoriteMovies()).to.have.length(1)
			expect(moviesStore.emitChange).to.be.calledOnce
		})
	})

	describe('when a "CHILD_REMOVED" is dispatched', function() {
		var movieWithKey = objectAssign(MOVIE, { firebaseKey: MOVIE_REF_KEY })
		var moviesStore, payload

		before(function() {
			payload = createPayload(SERVER_ACTION, CHILD_REMOVED, MOVIE_REF_KEY)

			moviesStore = new MoviesStore(dispatcher, firebaseService, omdbSvc)
			sinon.spy(moviesStore, 'emitChange')
		})

		after(function() {
			moviesStore.emitChange.restore()
		})

		it('should remove the movie from favoriteMovies array', function() {
			moviesStore._favoriteMovies = [ FAKE_MOVIE, FAKE_MOVIE, MOVIE, FAKE_MOVIE, FAKE_MOVIE ]
			expect(moviesStore.getFavoriteMovies()).to.have.length(5)
			moviesStore.handleAction(payload)
			expect(moviesStore.getFavoriteMovies()).to.have.length(4)
			expect(moviesStore.emitChange).to.be.calledOnce
		})
	})
})
