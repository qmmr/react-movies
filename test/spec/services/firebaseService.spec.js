import firebaseService from '../../../src/services/firebaseService'
import { ROOT_FIREBASE_URL, FAVORITE_MOVIES } from '../../../src/constants/constants'
import { CHILD_ADDED } from '../../../src/constants/firebaseTypes'
import getMovieStub from '../../utils/getMovieStub'

const FAVORITE_MOVIES_URL = `${ ROOT_FIREBASE_URL }/${ FAVORITE_MOVIES }`
const MOVIE_REF_KEY = '-JiiDpEbWl4bQiWu7MpF'
const MOVIE = getMovieStub()

// var Firebase = function() {}
// Firebase.prototype.toString = sinon.mock().returns(ROOT_FIREBASE_URL)

// var rootFirebaseRefMock = {}
var actions = {
	childAdded: sinon.spy()
}

describe('Given an instance of firebaseService', function() {
	var service

	describe('when invoking #getRootFirebaseRef', function() {
		before(function() {
			service = firebaseService(actions)
		})

		it('should have the same root URL as the argument passed to the service', function() {
			expect(service.getRootFirebaseRef().toString()).to.equal(ROOT_FIREBASE_URL)
		})
	})

	describe('when invoking #getFavoriteMoviesFirebaseRef', function() {
		before(function() {
			service = firebaseService(actions)
		})

		it('should return the url to the favorite-movies node', function() {
			expect(service.getFavoriteMoviesFirebaseRef().toString()).to.equal(FAVORITE_MOVIES_URL)
		})
	})

	describe('when invoking #addToFavoriteMovies', function() {
		var favoriteMoviesFBRef

		before(function() {
			service = firebaseService(actions)
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
			service = firebaseService(actions)
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
			// expect(movieRef.remove).to.be.calledWith(function () {
			// 	console.log('inside')
			// 	done()
			// })
		})
	})

	describe('when invoking #on', function() {
		describe('and the type is "CHILD_ADDED"', function() {
			var favoriteMoviesFBRef, callbackSpy

			before(function() {
				service = firebaseService(actions)
				favoriteMoviesFBRef = service.getFavoriteMoviesFirebaseRef()
				sinon.spy(favoriteMoviesFBRef, 'on')
				callbackSpy = sinon.spy()
				service.on(CHILD_ADDED)
			})

			after(function() {
				favoriteMoviesFBRef.on.restore()
			})

			it('should call favoriteMoviesFBRef.on', function() {
				expect(favoriteMoviesFBRef.on)
					.to.be.calledOnce
					.and.to.be.calledWith(CHILD_ADDED)
					// TODO: how to check for unique firebaseKey?
					// .and.calledWith(MOVIE)
			})

			it('should call #childAdded', function(done) {
				setTimeout(() => {
					expect(actions.childAdded).to.be.calledOnce
					done()
				}, 0)
			})
		})
	})
	// 	this._favoriteMoviesFBSvc.on('child_removed', (dataSnapshot) => {
	// 		this._removeFromFavoriteMovies(dataSnapshot.key())
	// 	})
})
