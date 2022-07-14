import {AuthStore} from './authStore'
import {UiStore} from './uiStore'
import CustomersStore from './customersStore'
import {SystemUsersStore} from './systemUsersStore'
import CarsStore from './carsStore'


const uiStore= new UiStore()
const authStore= new AuthStore(uiStore)
const customersStore= new CustomersStore(uiStore)
const systemUsersStore= new SystemUsersStore(uiStore)
const carsStore= new CarsStore(uiStore)

export const stores = {
	uiStore:uiStore,
	authStore:authStore,
	customersStore:customersStore,
	systemUsersStore:systemUsersStore,
	carsStore:carsStore
}