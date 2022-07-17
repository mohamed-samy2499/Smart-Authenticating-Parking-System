import { GButton, GDialog } from 'components/basic-blocks'
import { GTableColumn } from 'components/basic-blocks/g-table/types'
import moment from 'moment'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CreateEditCar } from './create-edit-car'

export const columns: Array<GTableColumn<any>> = [
	{ label: 'Plate Number', path: 'plateNumberId', className: '-mr-6' },
	{ label: 'Brand', path: 'brandName', className: '-mr-6' },
	{ label: 'Model', path: 'subCategory' },
	{ label: 'Color', path: 'color'},
	{ label: 'Start Date', path: 'systemUserRole' ,render: (row:any) => <RenderStartDate row={row} />},
	{ label: 'End Date', path: 'systemUserRole',render: (row:any) => <RenderEndDate row={row} />},
	{ label: 'Action', path: 'systemUserRole',render: (row:any) => <RenderActions row={row} />},
]

const RenderStartDate = (props:any)=>{
	const {row} = props
	return (<div>
		{moment(row?.startSubscription).format('LL')||''}
	</div>)
}
const RenderEndDate =(props:any)=>{
	const {row} = props
	return (<div>
		{moment(row?.endSubscription).format('LL')||''}
		{/* {row?.endSubscription?.toLocaleString([], {
			year: 'numeric',
			month: 'short',
			day: '2-digit'
		}) || ''} */}
	</div>)
}
const RenderActions = (props:any)=>{
	const {row} = props
	const [open,setOpen] = useState(false)
	return (
		<>
			<GDialog 
				title='Edit Car'
				open={open}
				onClose={()=>setOpen(false)}
			>
				<CreateEditCar data	={row} close={()=>setOpen(false)} />
			</GDialog>
			<GButton 
				label='Edit'
				variant='outlined'
				color='primary'
				onClick={()=>setOpen(true)}
			/>
		</>
	)
}