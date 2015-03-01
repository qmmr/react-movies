import omdbService from '../../../src/services/omdbService'

const MOVIE_TITLE = 'Filemon i Bonifacy'
const REQUEST_MOCK = {
	method: 'GET',
	url: 'http://www.omdbapi.com/?t=Filemon%20i%20Bonifacy&plot=short&r=json'
}
const OMDB_RESPONSE_OBJECT = {
	text: '{"Title":"Filemon i Bonifacy"}',
	type: 'text/html'
}

var actionsMock = {
	foundMovie: sinon.spy(),
	notFoundMovie: sinon.spy(),
	handleOMDBError: sinon.spy()
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
			before(function() {
				request = service.queryMovie(MOVIE_TITLE)
			})

			// after(function() {
			// 	request.end.restore()
			// })

			it('should call actions#foundMovie method with expected data', function(done) {
				var handleResponseSpy = sinon.spy()

				request.end(handleResponseSpy)
				// handleResponseSpy((resp) => {
				// 	expect(resp.text).to.be.be.a.string
				// 	expect(resp.text).to.contain(MOVIE_TITLE)
				// 	done()
				// })

				// request.end(handleResponseSpy)
				setTimeout(() => {
					expect(actionsMock.foundMovie).to.be.calledOnce
					// handleResponseSpy.callArgWith(0, OMDB_RESPONSE_OBJECT)
				}, 1)
			})
		})

		// describe('and response is a NO_MOVIE_DATA', function() {

		// })
	})
})
