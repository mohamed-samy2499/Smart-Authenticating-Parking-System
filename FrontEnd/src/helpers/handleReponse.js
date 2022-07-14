// helper function to process fetch API results

// var { logout = null } = userServices;

export async function handleResponse(response) {
	var text = await response.text()

	var data = text && JSON.parse(text)
	var { status, code, messages, result } = data

	if (status === 'error') {
		if (code === 401) {
			// logs out automatically if 401 code (unauthorized) is returned from API
			// logout();
			// location.reload(true);
		}

		var error = messages[0] || 'Oops, an error occurred. Please try again later'

		return Promise.reject(error)
	}

	return result
}
