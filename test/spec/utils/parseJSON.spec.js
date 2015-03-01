import parseJSON from '../../../src/utils/parseJSON'

describe('Given a parseJSON function', function() {
	it('should produce a valid object out of a valid string', function() {
		var JSONstring = '{"Title":"Batman","Year":"1989"}'
		var JSONObject = { Title: 'Batman', Year: '1989' }

		expect(parseJSON(JSONstring)).to.deep.equal(JSONObject)
	})

	it('should throw if given an invalid string', function() {
		var JSONstring = '{"Title":,"Year":"1989"}'

		expect(() => parseJSON(JSONstring)).to.throw(ReferenceError, /String is not a valid JSON string./)
	})
})
