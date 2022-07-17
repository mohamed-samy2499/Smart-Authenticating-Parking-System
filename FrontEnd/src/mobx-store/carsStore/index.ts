import { makeAutoObservable } from 'mobx'
import { history } from '../../helpers'
import { carsServices } from '../../Services/carsServices'
import { ApiCallStates } from '../types'
import { carsData } from './types'
import { UiStore } from '../uiStore'
import { parseError } from 'utils/errors'

export default class CarsStore {
	constructor(uiStore: UiStore) {
		this.uiStore = uiStore
		makeAutoObservable(this)
	}
	uiStore: UiStore

	cars: any[] = []
	getCarsState: ApiCallStates = ApiCallStates.IDLE
	carsArray: carsData[] = [
		{
			plateId: '123,GUD',
			brand: 'Hyndai',
			model: 'Verna',
			color: 'Yellow',
			startDate: new Date(),
			endDate: new Date()
		},
		{
			plateId: '123,GUD',
			brand: 'Volvo',
			model: 'XC40',
			color: 'Black',
			startDate: new Date(),
			endDate: new Date()
		}
	]

	createCar = async (data: carsData, close: any) => {
		try {
			await carsServices.createCar(data)
			close()
			this.getAllCars()
		} catch (error) {
			console.log(error)
		}
	}

	getAllCars = async () => {
		try {
			this.uiStore.setCallState('getCars', 'loading')
			const cars = await carsServices.getCars()
			this.cars = cars
			this.uiStore.setCallState('getCars', 'idle')
		} catch (error) {
			this.uiStore.setCallState('getCars', 'error', 'failed to get cars')
			console.log(error)
		}
	}

	updateCar = async (id: any, data: any, close: any) => {
		try {
			this.uiStore.setCallState('mutateCars', 'loading')
			await carsServices.updateCar(id, data)
			close()
			this.getAllCars()
			this.uiStore.setCallState('mutateCars', 'success', 'car added successfully')
		} catch (error) {
			console.log(error)
			this.uiStore.setCallState('mutateCars', 'error', parseError(error))
		}
	}
	// deleteCars = async (id: any) => {
	//   try {
	//     await userServices.deleteProduct(id);
	//     const newProducts = this.cars;
	//     this.cars = newProducts.filter((product: any) => {
	//       return product.id !== id;
	//     });
	//   } catch (error) {
	//     console.log(error);
	//   }
	// };
}
