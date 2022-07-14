//The user services file contains all backend api calls for performing CRUD
// operations on user data, as well as logging in and out of the  application.

import http from './httpService'

export const carsServices = {
	createCar,
	updateCar,
	deleteCar,
	getCars
}

// ************************************************************************

async function createCar(data: any) {
	const response = await http.post('Vehicles', data)

	return response.data
}

async function updateCar(data: any, id: any) {
	const response = await http.put(`items/updateItembyID/${id}`, data)

	return response.data
}
async function deleteCar(id: any) {
	const response = await http.delete(`items/deleteItembyID/${id}`)

	return response.data
}

async function getCars() {
	const response = await http.get('Vehicles')

	return response.data
}
