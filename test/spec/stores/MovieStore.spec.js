import MoviesStore from '../../../src/stores/MoviesStore'
import getMovieStub from '../../utils/getMovieStub'

const MOVIE = getMovieStub()
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

var firebaseMovieRef = {
	key: sinon.stub(),
	remove: sinon.spy()
}

var firebaseSvc = {
	on: sinon.spy(),
	push: sinon.stub(),
	child: sinon.stub()
}

var omdbSvc = {
	queryMovie: sinon.stub()
}

describe('Given an instance of the MoviesStore', function() {

	describe('when invoking #getFoundMovie', function() {
		describe('and no actions have been dispatched', function() {
			var moviesStore

			before(function() {
				moviesStore = new MoviesStore(dispatcher, firebaseSvc, omdbSvc)
			})

			it('should return null', function() {
				expect(moviesStore.getFoundMovie()).to.be.null
			})
		})

		describe('and the MOVIE_DATA have been dispatched', function() {
			var moviesStore

			before(function() {
				var payload = createPayload('SERVER_ACTION', 'MOVIE_DATA', MOVIE)

				moviesStore = new MoviesStore(dispatcher, firebaseSvc, omdbSvc)
				moviesStore.handleAction(payload)
			})

			it('should matche the found movie data', function() {
				expect(moviesStore.getFoundMovie()).to.deep.equal(MOVIE)
			})
		})

		describe('and the NO_MOVIE_DATA have been dispatched', function() {
			var moviesStore

			before(function() {
				var payload = createPayload('SERVER_ACTION', 'NO_MOVIE_DATA', NOT_FOUND_RESP)

				moviesStore = new MoviesStore(dispatcher, firebaseSvc, omdbSvc)
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
				moviesStore = new MoviesStore(dispatcher, firebaseSvc, omdbSvc)
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
			moviesStore = new MoviesStore(dispatcher, firebaseSvc, omdbSvc)
		})

		it('should return true if the movie was found', function() {
			moviesStore._foundMovie = MOVIE
			expect(moviesStore.hasFoundMovie()).to.be.true
		})

		it('should return false if the movie was NOT found', function() {
			expect(moviesStore.hasFoundMovie()).to.be.false
		})
	})

	describe('when a MOVIE_DATA is dispatched', function() {
		var moviesStore

		before(function() {
			var payload = createPayload('SERVER_ACTION', 'MOVIE_DATA', MOVIE)

			moviesStore = new MoviesStore(dispatcher, firebaseSvc, omdbSvc)
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

	describe('when NO_MOVIE_DATA is dispatched', function() {
		var moviesStore

		before(function() {
			var payload = createPayload('SERVER_ACTION', 'NO_MOVIE_DATA', NOT_FOUND_RESP)

			moviesStore = new MoviesStore(dispatcher, firebaseSvc, omdbSvc)
			sinon.spy(moviesStore, 'emitChange')
			moviesStore.handleAction(payload)
		})

		after(function() {
			moviesStore.emitChange.restore()
		})

		it('should assign NOT_FOUND_RESP to foundMovie key', function() {
			expect(moviesStore.emitChange).to.be.calledOnce
			expect(moviesStore.getFoundMovie()).to.deep.equal(NOT_FOUND_RESP)
		})
	})

	describe('when a QUERY_MOVIE is dispatched', function() {
		var moviesStore

		before(function() {
			var payload = createPayload('VIEW_ACTION', 'QUERY_MOVIE', 'Filemon i Bonifacy')

			omdbSvc.queryMovie.withArgs('Filemon i Bonifacy').returns(REQUEST_MOCK)
			moviesStore = new MoviesStore(dispatcher, firebaseSvc, omdbSvc)
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
			expect(moviesStore.emitChange).to.not.be.called
			expect(moviesStore.getLastRequest()).to.deep.equal(REQUEST_MOCK)
		})
	})

	describe('when a ADD_FAVORITE_MOVIE is dispatched', function() {
		var moviesStore

		before(function() {
			var payload = createPayload('VIEW_ACTION', 'ADD_FAVORITE_MOVIE', MOVIE)

			firebaseSvc.push.withArgs(MOVIE).returns(firebaseMovieRef)
			firebaseMovieRef.key.returns(MOVIE_REF_KEY)
			moviesStore = new MoviesStore(dispatcher, firebaseSvc, omdbSvc)
			sinon.spy(moviesStore, 'emitChange')
			moviesStore.handleAction(payload)
		})

		after(function() {
			moviesStore.emitChange.restore()
		})

		it('should remove the movie from foundMovie property', function() {
			expect(firebaseSvc.push)
				.to.be.calledOnce
				.and.to.be.calledWithExactly(MOVIE)
			expect(firebaseMovieRef.key).to.be.calledOnce
			expect(moviesStore.getFoundMovie()).to.be.null
			expect(moviesStore.emitChange).to.be.calledOnce
		})
	})

	describe('when a REMOVE_FAVORITE_MOVIE is dispatched', function() {
		var moviesStore

		before(function() {
			var payload = createPayload('VIEW_ACTION', 'REMOVE_FAVORITE_MOVIE', MOVIE_REF_KEY)

			firebaseSvc.child.withArgs(MOVIE_REF_KEY).returns(firebaseMovieRef)
			moviesStore = new MoviesStore(dispatcher, firebaseSvc, omdbSvc)
			sinon.spy(moviesStore, 'emitChange')
			moviesStore.handleAction(payload)
		})

		after(function() {
			moviesStore.emitChange.restore()
		})

		it('should remove the movie from foundMovie property', function() {
			expect(firebaseSvc.child).to.be.calledOnce
			expect(firebaseMovieRef.remove).to.be.calledOnce
			expect(moviesStore.emitChange).to.not.be.called
		})
	})
})
