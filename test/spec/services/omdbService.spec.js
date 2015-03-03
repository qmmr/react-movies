import omdbService from '../../../src/services/omdbService'

const MOVIE_TITLE = 'Filemon i Bonifacy'
const REQUEST_MOCK = {
	method: 'GET',
	url: 'http://www.omdbapi.com/?t=Filemon%20i%20Bonifacy&plot=short&r=json'
}

var actionsMock = {
	foundMovie: sinon.spy(),
	notFoundMovie: sinon.spy(),
	handleOMDBError: sinon.spy()
}

describe('Given an instance of omdbService', function() {
	var service, xhr, requests

	before(function() {
		service = omdbService(actionsMock)

		xhr = sinon.useFakeXMLHttpRequest()
		xhr.onCreate = function(req) {
			requests.push(req)
		}
	})

	beforeEach(function() {
		requests = []
	})

	after(function() {
		xhr.restore()
	})

	describe('invoking the #queryMovie', function() {
		it('should perform a `GET` request to specified endpoint', function() {
			service.queryMovie(MOVIE_TITLE)

			var [ request ] = requests

			expect(requests).to.have.length(1)
			expect(request).to.have.property('method', REQUEST_MOCK.method)
			expect(request).to.have.property('url', REQUEST_MOCK.url)
		})

		describe('and the response status is 200', function() {
			beforeEach(function() {
				requests = []
			})

			describe('when the response.text has error "Movie not found!"', function() {
				it('should invoke the actions#notFoundMovie method with expected data', function() {
					const MOVIE_NOT_FOUND_RESPONSE = '{"Response":"False","Error":"Movie not found!"}'
					const OMDB_RESPONSE_OBJECT = { Error: 'Movie not found!', Response: 'False' }

					service.queryMovie(MOVIE_TITLE)

					let [ request ] = requests
					request.respond(200, { 'Content-Type': 'application/json' }, MOVIE_NOT_FOUND_RESPONSE)

					expect(actionsMock.notFoundMovie)
						.to.be.calledOnce
						.and.to.be.calledWith(OMDB_RESPONSE_OBJECT)
				})
			})

			describe('when the response is a found movie', function() {
				it('should invoke actions#foundMovie method with expected data', function() {
					const OMDB_RESPONSE_STRING = '{"text":{"Title":"Filemon i Bonifacy"},"type":"text/html"}'
					const OMDB_RESPONSE_OBJECT = { text: { Title: 'Filemon i Bonifacy' }, type: 'text/html' }

					service.queryMovie(MOVIE_TITLE)

					let [ request ] = requests
					request.respond(200, { 'Content-Type': 'application/json' }, OMDB_RESPONSE_STRING)

					expect(actionsMock.foundMovie)
						.to.be.calledOnce
						.and.to.be.calledWith(OMDB_RESPONSE_OBJECT)
				})
			})
		})
	})


	describe('when #queryMovie is a failure', function() {
		it('should invoke actions#foundMovie method with expected data', function() {
			const ERROR = {
				status: 500,
				method: 'GET',
				url: 'http://www.omdbapi.com/?t=Filemon%20i%20Bonifacy&plot=short&r=json'
			}

			service.queryMovie(MOVIE_TITLE)

			let [ request ] = requests
			request.respond(500, { 'Content-Type': 'text/plain' }, 'SERVER ERROR')

			expect(requests).to.have.length(1)
			expect(actionsMock.handleOMDBError)
				.to.be.calledOnce
				.and.to.be.calledWith()
		})
	})
})
