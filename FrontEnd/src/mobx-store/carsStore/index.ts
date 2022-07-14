import { makeAutoObservable } from 'mobx'
import { history } from '../../helpers'
import { carsServices } from '../../Services/carsServices'
import { ApiCallStates } from '../types'
import { carsData } from './types'
import { UiStore } from '../uiStore'

export default class CarsStore {
	constructor(uiStore: UiStore) {
		this.uiStore = uiStore
		makeAutoObservable(this)
	}
	uiStore: UiStore

	cars: carsData[] = []
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

	createCar = async (data: carsData) => {
		try {
			await carsServices.createCar(data)
			history.push('/admin/cars')
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

	updateCars = async (data: any, id: any) => {
		try {
			this.getCarsState = ApiCallStates.LOADING
			const cars = await carsServices.updateCar(id, data)
			this.cars = cars
			this.getCarsState = ApiCallStates.SUCCEEDED
			history.push('/admin/cars')
		} catch (error) {
			console.log(error)
			this.getCarsState = ApiCallStates.FAILED
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
