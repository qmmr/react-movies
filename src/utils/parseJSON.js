export default function parseJSON(string) {
	var result

	try {
		result = JSON.parse(string)
	} catch(e) {
		throw new ReferenceError('String is not a valid JSON string.')
	}

	return result
}
