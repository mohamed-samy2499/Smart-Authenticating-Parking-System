//The user services file contains all backend api calls for performing CRUD
// operations on user data, as well as logging in and out of the  application.

import http from './httpService'

export const userServices = {
	signup,

	login,
	getUserData
}

// ************************************************************************

async function signup(data: any) {
	const response = await http.post('user/create', data)
}

async function login(data: any) {
	const response = await http.post('SystemUsers/login', data)

	return response.data
}

async function getUserData() {
	// const email = <string>localStorage.getItem("email");
	// const parsedEmail: string = JSON.parse(email);
	const response = await http.get('SystemUsers/me')

	return response.data
	// http: return response.result.user;
}
