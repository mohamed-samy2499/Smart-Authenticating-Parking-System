//The user services file contains all backend api calls for performing CRUD
// operations on user data, as well as logging in and out of the  application.

import http from './httpService'

export const systemUsersServices = {
	createSystemUser,
	updateSystemUser,
	deleteSystemUser,
	getSystemUsers
}

// ************************************************************************

async function createSystemUser(data: any) {
	const response = await http.post('SystemUsers/signup', data)

	return response.data
}

async function updateSystemUser(data: any, id: any) {
	const response = await http.put(`items/updateItembyID/${id}`, data)

	return response.data
}
async function deleteSystemUser(id: any) {
	const response = await http.delete(`items/deleteItembyID/${id}`)

	return response.data
}

async function getSystemUsers() {
	const response = await http.get('SystemUsers')

	return response.data
}
