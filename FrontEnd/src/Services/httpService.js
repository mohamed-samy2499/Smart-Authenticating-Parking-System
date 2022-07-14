//TODOS
//add a logging serivce
//add a notification module for handling all kind of errors {toastify}
/***********************/
import axios from 'axios'
import { authHeader } from '../helpers'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL
axios.defaults.headers.common = authHeader()

function setLogoutListener(logout) {
	axios.interceptors.response.use(null, error => {
		const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500

		if (!expectedError) {
			console.log(error)
		}
		if(error?.response?.status === 401){
			logout()
		}

		return Promise.reject(error)
	})
}

export default {
	request: axios.request,
	get: axios.get,
	delete: axios.delete,
	head: axios.head,
	options: axios.options,
	post: axios.post,
	put: axios.put,
	patch: axios.patch,
	setLogoutListener:setLogoutListener,
}
