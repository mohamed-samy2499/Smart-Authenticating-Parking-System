import { makeAutoObservable, runInAction } from 'mobx'
import { history } from '../../helpers'
import { systemUsersServices } from '../../Services/systemUsersServices'
import { ApiCallStates } from '../types'
import { customerData } from './types'
import { UiStore } from '../uiStore'

export class SystemUsersStore {
	constructor(uiStore: UiStore) {
		this.uiStore = uiStore
		makeAutoObservable(this)
	}
	uiStore: UiStore
	systemUsers: any = []
	getSystemUsersState: ApiCallStates = ApiCallStates.IDLE

	createSystemUser = async (data: any) => {
		// const newArray = this.SystemUsersArray;
		// newArray.push(data);
		// this.SystemUsersArray = newArray;
		// history.push("/admin/SystemUsers");
		try {
			this.uiStore.setCallState('mutateSystemUsers', 'loading')
			await systemUsersServices.createSystemUser(data)
			runInAction(() => {
				this.getAllSystemUsers()
			})
			this.uiStore.setCallState('mutateSystemUsers', 'idle')
		} catch (error) {
			this.uiStore.setCallState('mutateSystemUsers', 'error', 'failed to add user')
			console.log(error)
		}
	}
	getAllSystemUsers = async () => {
		try {
			this.uiStore.setCallState('getSystemUsers', 'loading')
			this.getSystemUsersState = ApiCallStates.LOADING
			const systemUsers = await systemUsersServices.getSystemUsers()
			this.systemUsers = systemUsers
			this.getSystemUsersState = ApiCallStates.SUCCEEDED
			this.uiStore.setCallState('getSystemUsers', 'success')
		} catch (error) {
			console.log(error)
			this.getSystemUsersState = ApiCallStates.FAILED
			this.uiStore.setCallState('getSystemUsers', 'error', 'failed to get system users')
		}
	}
	// updateCustomer = async (data: any, id: any) => {
	//   const newCustomerArray = [...this.SystemUsersArray];

	//   // try {
	//   //   await userServices.updateProduct(data, id);
	//   //   history.push("/admin/products");
	//   // } catch (error) {
	//   //   console.log(error);
	//   // }
	// };
	// deleteCustomer = async (id: any) => {
	//   try {
	//     await userServices.deleteProduct(id);
	//     const newProducts = this.SystemUsers;
	//     this.SystemUsers = newProducts.filter((product: any) => {
	//       return product.id !== id;
	//     });
	//   } catch (error) {
	//     console.log(error);
	//   }
	// };
}
