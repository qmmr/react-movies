import firebaseService from '../../../src/services/firebaseService'
import { ROOT_FIREBASE_URL, FAVORITE_MOVIES } from '../../../src/constants/constants'
import { CHILD_ADDED, CHILD_REMOVED } from '../../../src/constants/firebaseTypes'
import getMovieStub from '../../utils/getMovieStub'

const FAVORITE_MOVIES_URL = `${ ROOT_FIREBASE_URL }/${ FAVORITE_MOVIES }`
const MOVIE_REF_KEY = '-JiiDpEbWl4bQiWu7MpF'
const MOVIE = getMovieStub()

var actions = {
	childAdded: sinon.spy(),
	childRemoved: sinon.spy()
}

describe('Given an instance of firebaseService', function() {
	var service

	before(function() {
		service = firebaseService(actions)
	})

	describe('when invoking #getRootFirebaseRef', function() {
		it('should have the same root URL as the argument passed to the service', function() {
			expect(service.getRootFirebaseRef().toString()).to.equal(ROOT_FIREBASE_URL)
		})
	})

	describe('when invoking #getFavoriteMoviesFirebaseRef', function() {
		it('should return the url to the favorite-movies node', function() {
			expect(service.getFavoriteMoviesFirebaseRef().toString()).to.equal(FAVORITE_MOVIES_URL)
		})
	})

	describe('when invoking #addToFavoriteMovies', function() {
		var favoriteMoviesFBRef

		before(function() {
			favoriteMoviesFBRef = service.getFavoriteMoviesFirebaseRef()
			sinon.spy(favoriteMoviesFBRef, 'push')
			service.addToFavoriteMovies(MOVIE)
		})

		after(function() {
			favoriteMoviesFBRef.push.restore()
		})

		it('should call the push method on the favoriteMoviesFirebaseRef', function() {
			expect(favoriteMoviesFBRef.push)
				.to.be.calledOnce
				.and.to.be.calledWith(MOVIE)
		})
	})

	describe('when invoking #removeFromFavoriteMovies', function() {
		var movieRef = {
			remove: sinon.spy()
		}
		var errorHandlerSpy = sinon.spy()
		var favoriteMoviesFBRef

		before(function() {
			favoriteMoviesFBRef = service.getFavoriteMoviesFirebaseRef()
			sinon.stub(favoriteMoviesFBRef, 'child')
			favoriteMoviesFBRef.child.withArgs(MOVIE_REF_KEY).returns(movieRef)
			service.removeFromFavoriteMovies(MOVIE_REF_KEY)
		})

		after(function() {
			favoriteMoviesFBRef.child.restore()
		})

		it('should call the remove method on the movieRef', function() {
			expect(movieRef.remove).to.be.calledOnce
		})
	})

	describe('when invoking #on', function() {
		describe('and the type is `CHILD_ADDED`', function() {
			var favoriteMoviesFBRef

			before(function() {
				favoriteMoviesFBRef = service.getFavoriteMoviesFirebaseRef()
				sinon.stub(favoriteMoviesFBRef, 'on')
			})

			after(function() {
				favoriteMoviesFBRef.on.restore()
			})

			it('should call favoriteMoviesFBRef.on', function(done) {
				var callback = sinon.stub()

				service.on(CHILD_ADDED)
				// expect(favoriteMoviesFBRef.on)
				// 	.to.be.calledOnce
				// 	.and.to.be.calledWith(CHILD_ADDED, sinon.match.func)

				favoriteMoviesFBRef.on
					.withArgs(CHILD_ADDED, sinon.match.func)
					.callsArgWithAsync(1, null, {}, {})
				favoriteMoviesFBRef.on(CHILD_ADDED, callback)

				setTimeout(() => {
					expect(callback).to.be.calledOnce
					done()
				}, 0)
					// TODO: how to check for unique firebaseKey?
					// .and.calledWith(MOVIE)
			})

			// it.skip('should call actions#childAdded', function(done) {

			// })
		})

		describe.skip('and the type is `CHILD_REMOVED`', function() {
			var favoriteMoviesFBRef, callbackSpy

			before(function() {
				favoriteMoviesFBRef = service.getFavoriteMoviesFirebaseRef()
				sinon.spy(favoriteMoviesFBRef, 'on')
				callbackSpy = sinon.spy()
				service.on(CHILD_REMOVED)
			})

			after(function() {
				favoriteMoviesFBRef.on.restore()
			})

			it('should call favoriteMoviesFBRef.on', function() {
				expect(favoriteMoviesFBRef.on)
					.to.be.calledOnce
					.and.to.be.calledWith(CHILD_REMOVED)
			})

			it('should call actions#childRemoved', function(done) {
				service.removeFromFavoriteMovies(MOVIE_REF_KEY)
				setTimeout(() => {
					expect(actions.childRemoved).to.be.calledOnce
					done()
				}, 0)
			})
		})
	})
})
