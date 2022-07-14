// Auth header is a helper function that returns an HTTP Authorization header
// containing the Json Web Token (JWT) of the currently logged in user from
// local storage. If the user isn't logged in an empty object is returned.

export function authHeader() {
	let token = JSON.parse(localStorage.getItem('token'))

	if (token) {
		return {
			Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		}
	} else {
		return {}
	}
}
