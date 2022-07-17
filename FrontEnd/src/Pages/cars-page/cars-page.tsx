import { useEffect, useState } from 'react'
import { useStores } from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { GButton, GDialog, GLoading, GSection, GTable } from 'components/basic-blocks'
import {columns} from './columns'
import { CreateEditCar } from './create-edit-car'

export const CarsPage = observer(() => {
	const { carsStore,uiStore } = useStores()
	const { getAllCars, cars} = carsStore

	useEffect(() => {
		const getData = () => {
			getAllCars()
		}
		getData()
	}, [])

	if(!cars) return <GLoading />
	return (
		<GSection 
			title="Cars Page"
			actions={<AddCar />}
		>
			<GTable<any>
				columns={columns}
				data={cars}
			/>
		</GSection>
	)

	function AddCar(){
		const [open,setOpen] = useState(false)
		return(
			<>
				<GDialog
					title='Add Car'
					open={open}
					onClose={()=>setOpen(false)}
				>
					<CreateEditCar close={()=>setOpen(false)} />
				</GDialog>
				<GButton 
					label='Add Car'
					size='sm'
					variant='contained'
					color='primary'
					onClick={()=>setOpen(true)}
				/>
			</>
		)
	}
})
