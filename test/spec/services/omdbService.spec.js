import omdbService from '../../../src/services/omdbService'
import Request from 'superagent'

const MOVIE_TITLE = 'Filemon i Bonifacy'
const REQUEST_MOCK = {
	method: 'GET',
	url: 'http://www.omdbapi.com/?t=Filemon%20i%20Bonifacy&plot=short&r=json'
}

var actionsMock = {
	foundMovie: sinon.spy(),
	notFoundMovie: sinon.spy()
}

describe('Given an instance of omdbService', function() {
	var service

	before(function() {
		service = omdbService(actionsMock)
	})

	describe('when invoking the #queryMovie', function() {
		var request

		before(function() {
			request = service.queryMovie(MOVIE_TITLE)
		})

		it('should return a request object', function () {
			var { method, url } = request

			expect(method).to.equal(REQUEST_MOCK.method)
			expect(url).to.equal(REQUEST_MOCK.url)
		})

		describe.skip('and response is a MOVIE_DATA', function() {
			var endStub

			before(function() {
				request = service.queryMovie(MOVIE_TITLE)
				endStub = sinon.stub(request.__proto__, 'end')
			})

			after(function() {
				request.end.restore()
			})

			it('should send action type MOVIE_DATA and correct data', function() {
				// expect(actionsMock.foundMovie).to.be.calledOnce
				// expect(actionsMock.notFoundMovie).to.not.be.called
				expect(request.end).to.be.calledOnce
			})
		})

		// describe('and response is a NO_MOVIE_DATA', function() {

		// })
	})
})
