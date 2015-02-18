// __tests__/sum-test.js
jest.dontMock('../../src/stores/MovieStore');

describe('Given a MovieStore', function() {
	it('shoudl be an object', function() {
		var MovieStore = require('../../src/stores/MovieStore')

		expect(MovieStore).toBe('object');
	});
});
