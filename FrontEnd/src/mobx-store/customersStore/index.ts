import { makeAutoObservable, runInAction } from 'mobx'
import { UiStore } from 'mobx-store/uiStore'
import { history } from '../../helpers'
import { customerServices } from '../../Services/customerService'
import { ApiCallStates } from '../types'
import { customerData } from './types'

export default class CustomersStore {
	constructor(uiStore: UiStore) {
		this.uiStore = uiStore
		makeAutoObservable(this)
	}
	uiStore: UiStore

	customers: customerData[] = []
	getCustomersState: ApiCallStates = ApiCallStates.IDLE
	logs: any[] = []

	createCustomer = async (data: customerData, onClose: () => void) => {
		// const newArray = this.customersArray;
		// newArray.push(data);
		// this.customersArray = newArray;
		// history.push("/admin/customers");
		try {
			this.uiStore.setCallState('mutateCustomers', 'loading')
			await customerServices.createCustomer(data)
			onClose()
			this.getAllCustomers()
			this.uiStore.setCallState('mutateCustomers', 'success', 'Customer created!')
		} catch (error) {
			console.log(error)
			this.uiStore.setCallState('mutateCustomers', 'loading', 'Failed to create customer')
		}
	}

	getAllCustomers = async () => {
		try {
			this.uiStore.setCallState('getCustomers', 'loading')
			const customers = await customerServices.getCustomers()
			this.customers = customers
			this.uiStore.setCallState('getCustomers', 'idle')
		} catch (error) {
			this.uiStore.setCallState('getCustomers', 'error', 'failed to get customers')
			console.log(error)
		}
	}
	updateCustomer = async (data: any, id: any, onClose: () => void) => {
		try {
			this.uiStore.setCallState('mutateCustomers', 'loading')
			await customerServices.updateCustomer(data, id)
			this.getAllCustomers()
			onClose()
			this.uiStore.setCallState('mutateCustomers', 'success', 'Customer update!')
		} catch (error) {
			console.log(error)
			this.uiStore.setCallState('mutateCustomers', 'error', 'Failed to update customer')
		}
	}

	uploadVideo = async (formData: any, id: string) => {
		try {
			this.uiStore.setCallState('uploadCustomerVideo', 'loading')
			await customerServices.uploadVideo(formData, id)
			this.uiStore.setCallState('uploadCustomerVideo', 'success', 'video Uploaded')
			runInAction(async () => {
				await this.getAllCustomers()
			})
		} catch (error: any) {
			this.uiStore.setCallState('uploadCustomerVideo', 'error', 'failed to upload video')
		}
	}

	getCustomerLogs = async (id: string) => {
		try {
			this.uiStore.setCallState('getCustomerLogs', 'loading')
			const logs = await customerServices.getCustomerLog(id)
			this.logs === logs
			this.uiStore.setCallState('getCustomerLogs', 'success')
		} catch (error: any) {
			this.uiStore.setCallState('getCustomerLogs', 'error', 'failed to get logs')
		}
	}
	// deleteCustomer = async (id: any) => {
	//   try {
	//     await userServices.deleteProduct(id);
	//     const newProducts = this.customers;
	//     this.customers = newProducts.filter((product: any) => {
	//       return product.id !== id;
	//     });
	//   } catch (error) {
	//     console.log(error);
	//   }
	// };
}
