//The user services file contains all backend api calls for performing CRUD
// operations on user data, as well as logging in and out of the  application.

import http from './httpService'

export const customerServices = {
	createCustomer,
	updateCustomer,
	deleteCustomer,
	getCustomers
}

// ************************************************************************

async function createCustomer(data: any) {
	const response = await http.post('Participants', data)

	return response.data
}

async function updateCustomer(data: any, id: any) {
	const response = await http.put(`Participants/${id}/update-admin`, data)

	return response.data
}
async function deleteCustomer(id: any) {
	const response = await http.delete(`items/deleteItembyID/${id}`)

	return response.data
}

async function getCustomers() {
	const response = await http.get('Participants')

	return response.data
}
