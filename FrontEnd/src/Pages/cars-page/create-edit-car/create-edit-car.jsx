// itemData ? itemData.endDate.toISOString().split("T")[0] : "";
import { useState } from 'react'

import { carBrands, carModels } from './constants'
import { observer } from 'mobx-react'
import { useStores } from '../../../hooks/useStores'
import { GButton, GInput, GListbox } from 'components/basic-blocks'
import moment from 'moment'
import { carEditScheme } from './validations'

export const CreateEditCar = observer((props) => {
	const {data,close} = props

	const { carsStore,uiStore } = useStores()
	const { createCar,updateCar} = carsStore
	

	const [errors, setErrors] = useState()

	const [formState, setFormState] = useState({
		plate:data?.plateNumberId||'',
		brand:data?.brandName ||'',
		model:data?.subCategory ||'',
		color:data?.color ||'',
		startDate: data?.startSubscription? data?.startSubscription :'',
		endDate: data?.endSubscription? data?.endSubscription :''
	})

	const handleSubmit = () => {
		const payload = {
			PlateNumberId: formState.plate,
			BrandName: formState.brand,
			SubCategory: formState.model,
			Color: formState.color,
			StartSubscription: formState.startDate,
			EndSubscription: formState.endDate
		}
		const errors = validate()
		setErrors(errors)

		if (errors) return
		data
			? updateCar(formState.plate, payload,close)
			: createCar(payload,close)
	}
	return (
		<>
			<div className='space-y-1'>
				<div className='relative z-50'>
					<GListbox
						label='Brand'
						placeholder='Select Brand'
						options={carBrands}
						value={formState.brand}
						onChange={(e)=>handleChange(e,'brand')}
						renderLabel={(e)=>e}
						error={errors?.brand}
					/>
				</div>
				<GListbox
					label='Model'
					placeholder='Select Model'
					options={carModels[formState.brand]}
					value={formState.model}
					onChange={(e)=>handleChange(e,'model')}
					renderLabel={(e)=>e}
					disabled={!formState.brand}
					error={errors?.model}
				/>
				
				<GInput 
					label="Color"
					id="color"
					name="color"
					value={formState.color}
					onChange={e => handleChange(e.target.value, 'color')}
					error={errors?.color}
				/>
				<GInput 
					label="Plate Number"
					id="plate"
					name="plate"
					value={formState.plate}
					onChange={e => handleChange(e.target.value, 'plate')}
					error={errors?.plate}
					disabled={data}
				/>
				<GInput 
					label='Start Date'
					id="start-date"
					name="start-date"
					value={moment(formState.startDate).format('YYYY-MM-DD')}
					onChange={e => handleChange(e.target.value, 'startDate')}
					type="date"
					error={errors?.startDate}
				/>
				<GInput 
					label='End Date'
					id="end-date"
					name="end-date"
					value={moment(formState.endDate).format('YYYY-MM-DD')}
					onChange={e => handleChange(e.target.value, 'endDate')}
					type="date"
					error={errors?.endDate}
				/>			
			</div>
			<div className='flex justify-end mt-4'>
				<GButton 
					label='Save'
					variant='contained'
					color='primary'
					onClick={()=>{	handleSubmit()}} 
					loading={uiStore.apiCallStates.mutateCars==='loading'}
				/>
			</div>
		</>
	)

	function handleChange(value, name) {
		if (name === 'brand') {
			setFormState({ ...formState, [name]: value, model: '' })
		} else {
			setFormState({ ...formState, [name]: value })
		}
	}

	function validate() {
		const options = { abortEarly: false }
		const { error } = carEditScheme.validate({
			plate: formState.plate,
			brand: formState.brand,
			model: formState.model,
			color: formState.color,
			startDate: formState.startDate,
			endDate: formState.endDate,
		}, options)

		if (!error) return null

		const errors= {}

		error.details.forEach((item) => {
			errors[item.path[0]] = item.message
		})
		return errors
	}
})
