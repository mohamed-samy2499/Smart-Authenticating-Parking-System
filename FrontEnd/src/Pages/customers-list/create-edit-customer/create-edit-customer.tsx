// itemData ? itemData.endDate.toISOString().split("T")[0] : "";
import { useEffect, useState } from 'react'

import { carBrands, carModels } from './constants'
import { observer } from 'mobx-react'
import { useStores } from '../../../hooks/useStores'
import { GButton, GInput, GListbox, GLoading } from 'components/basic-blocks'
import moment from 'moment'
import { customerEditSchema } from './validations'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { classNames } from 'utils'
const people = [
	{ id: 1, name: 'Wade Cooper' },
	{ id: 2, name: 'Arlene Mccoy' },
	{ id: 3, name: 'Devon Webb' },
	{ id: 4, name: 'Tom Cook' },
	{ id: 5, name: 'Tanya Fox' },
	{ id: 6, name: 'Hellen Schmidt' },
	{ id: 7, name: 'Caroline Schultz' },
	{ id: 8, name: 'Mason Heaney' },
	{ id: 9, name: 'Claudie Smitham' },
	{ id: 10, name: 'Emil Schaefer' },
]
export const CreateEditCustomer = observer((props:any) => {
	const {row,onClose} = props
	const data = row

	const { customersStore,uiStore,carsStore } = useStores()
	const { getAllCars, cars} = carsStore
	const { createCustomer, updateCustomer } = customersStore
	const [errors, setErrors] = useState<any>()
	const [selected,setSelected] = useState<any>()
	const [vehicles, setVehicles] = useState<any>(data?.vehicles||[],)
	console.log('data',data)



	const [formState, setFormState] = useState<any>({
		name:data?.name ||'',
		nid:data?.nationalId ||'',
		isEgyptian:data?.isEgyptian ||true,
		email: data?.email||'',
	})

	useEffect(() => {
		const getData = () => {
			getAllCars()
		}
		getData()
	}, [])




	const handleSubmit = () => {
		const payload = {
			name: formState.name,
			NationalId: formState.nid,
			isEgyptian: formState.isEgyptian,
			email: formState.email,
			PlateNumberIds: vehicles.map((item:any)=>(item.plateNumberId)),
		}
		const errors = validate()
		setErrors(errors)
		console.log('errors',errors)
		if (errors) return
		data
			? updateCustomer(payload, data.id,onClose)
			: createCustomer(payload,onClose)
	}

	if(!cars) return <GLoading />

	return (
		<>
			<div className='space-y-1'>
				<div className=''>
					<GInput 
						label="Name"
						id="name"
						name="name"
						value={formState.name}
						onChange={e => handleChange(e.target.value, 'name')}
						error={errors?.name}
					/>
					<GInput 
						label="Email"
						id="email"
						name="email"
						value={formState.email}
						onChange={e => handleChange(e.target.value, 'email')}
						error={errors?.email}
					/>
					
					<GInput 
						label="National ID"
						id="nid"
						name="nid"
						value={formState.nid}
						onChange={e => handleChange(e.target.value, 'nid')}
						error={errors?.nid}
					/>
					<div>
						<Listbox value={vehicles} onChange={(e:any)=>handleVehiclesChange(e)} multiple>
							{({ open }) => (
								<>
									<Listbox.Label className="block text-sm font-medium text-gray-700">Assigned Cars</Listbox.Label>
									<div className="mt-1 relative">
										<Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
											{vehicles.length === 0 ?'Select Vehicles' : vehicles.map((selected:any) => selected.plateNumberId).join(', ')}
											{/* {vehicles.map((selected:any) => selected.plateNumberId).join(', ')} */}
											{/* <span className="block truncate">{selected?.name}</span>
											<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
												<SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
											</span> */}
										</Listbox.Button>

										<Transition
											show={open}
											as={'div'}
											leave="transition ease-in duration-100"
											leaveFrom="opacity-100"
											leaveTo="opacity-0"
										>
											<Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
												{console.log('cars',cars)}
												{cars.map((car) => (
													<Listbox.Option
														key={car.plateNumberId}
														className={({ active }) =>
															classNames(
																active ? 'text-white bg-indigo-600' : 'text-gray-900',
																'cursor-default select-none relative py-2 pl-3 pr-9'
															)
														}
														value={car}
													>
														{({ selected, active }) => (
															<>
																<span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
																	{car?.plateNumberId}
																</span>

																{selected ? (
																	<span
																		className={classNames(
																			active ? 'text-white' : 'text-indigo-600',
																			'absolute inset-y-0 right-0 flex items-center pr-4'
																		)}
																	>
																		<CheckIcon className="h-5 w-5" aria-hidden="true" />
																	</span>
																) : null}
															</>
														)}
													</Listbox.Option>
												))}
											</Listbox.Options>
										</Transition>
									</div>
								</>
							)}
						</Listbox>
						{errors?.selectedVehicles &&
							<p className="mt-1 text-sm text-danger-500" id="email-description">{errors?.selectedVehicles}</p>
						}
					</div>
				</div>
			</div>
			<div className='flex justify-end mt-4'>
				<GButton 
					label='Save'
					variant='contained'
					color='primary'
					onClick={()=>{handleSubmit()}} 
					loading={uiStore.apiCallStates.mutateCars==='loading'}
				/>
			</div>
		</>
	)


	function handleVehiclesChange(e:any){
		console.log(e)
		setVehicles(e)
	}
	function handleChange(value:any, name:any) {
		console.log('value',value)
		if (name === 'nid') {
			if(value.length > 14 ) return
			setFormState({ ...formState, [name]: value, model: '' })
		} else {
			setFormState({ ...formState, [name]: value })
		}
	}

	function validate() {
		const options = { abortEarly: false }
		const { error } = customerEditSchema.validate({
			email: formState.email,
			name: formState.name,
			nid: formState.nid,
			isEgyptian: formState.isEgyptian,
			selectedVehicles: vehicles,
		}, options)

		if (!error) return null

		const errors:any= {}

		error.details.forEach((item) => {
			errors[item.path[0]] = item.message
		})
		return errors
	}
})
