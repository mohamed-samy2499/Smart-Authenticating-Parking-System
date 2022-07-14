import { makeAutoObservable } from 'mobx'
import httpService from 'Services/httpService'
import { history } from '../../helpers'
import { userServices } from '../../Services/userServices'
import { ApiCallStates } from '../types'
import { UiStore } from '../uiStore'

export class AuthStore {
	constructor(uiStore: UiStore) {
		this.uiStore = uiStore
		makeAutoObservable(this)

		const authTokens = localStorage.getItem('token')
		if (authTokens) {
			this.token = JSON.parse(authTokens)
		}
	}
	uiStore: UiStore

	token: any = null
	user: any = null
	getUserState: ApiCallStates = ApiCallStates.IDLE


	getAccessToken = () => {
		const updatedToken = localStorage.getItem('token')
		if (updatedToken) {
			this.token = JSON.parse(updatedToken)
			return JSON.parse(updatedToken)
		}
	}
	login = async (data: any) => {
		try {
			this.uiStore.setCallState('login', 'loading')
			const { token, email } = await userServices.login(data)
			await localStorage.setItem('token', JSON.stringify(token))
			this.token = token
			this.uiStore.setCallState('login', 'idle')
			window.location.replace('/')
		} catch (error) {
			this.uiStore.setCallState('login', 'error', 'Invalid email or password')
		}
	}

	isUserLoggedIn = () => {
		return this.token ? true : false
	}

	getUserData = async () => {
		try {
			this.getUserState = ApiCallStates.LOADING
			const userData = await userServices.getUserData()
			this.user = userData

			this.getUserState = ApiCallStates.SUCCEEDED
		} catch (error) {
			console.log(error)
			this.getUserState = ApiCallStates.FAILED
		}
	}
	// signUp = async (data: any) => {
	//   try {
	//     await userServices.signup(data);
	//     history.push("/login");
	//   } catch (error) {
	//     console.log(error);
	//   }
	// };

	logout = async () => {
		localStorage.removeItem('token')
		this.user = null
		this.token = null
		history.push('/')
		window.location.reload()
	}
}
