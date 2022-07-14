import { GButton, GDialog } from 'components/basic-blocks'
import { GTableColumn } from 'components/basic-blocks/g-table/types'
import moment from 'moment'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CreateEditCustomer } from './customer-table/create-edit-customer'
// import { CreateEditCar } from './create-edit-car'

export const columns: Array<GTableColumn<any>> = [
	{ label: 'Name', path: 'name', className: '-mr-6' },
	{ label: 'Email', path: 'email', className: '-mr-6' },
	// { label: 'Plate ID', path: 'vehicles[0]?.plateNumberId' },
	{ label: 'Start Date', path: 'startDate',render: (row:any) => <RenderStartDate row={row} />},
	{ label: 'End Date', path: 'endDate',render: (row:any) => <RenderEndDate row={row} />},
	{ label: 'Status', path: 'status' ,render: (row:any) => <RenderStatus row={row} />},
	{ label: 'Action', path: '',render: (row:any) => <RenderActions row={row} />},
]

const RenderStartDate = (props:any)=>{
	const {row} = props
	console.log('startDate',row)
	return (
		<div>
			{moment(row?.vehicles[0]?.startSubscription).format('LL')||''}
		</div>)
}
const RenderEndDate =(props:any)=>{
	const {row} = props
	return (<div>
		{moment(row?.vehicles[0]?.endSubscription).format('LL')||''}
	</div>)
}

const RenderStatus =(props:any)=>{
	const {row} = props
	return (<div>
		{row.status ? 'Activated' : 'Not-Active'}
	</div>)
}



const RenderActions = (row:any)=>{
	const [openEdit,setOpenEdit] = useState(false)
	const [openLogs,setOpenLogs] = useState(false)
	return (
		<div className='flex gap-4'>
			<GDialog
				open={openLogs}
				onClose={()=>setOpenLogs(false)}
			>
				<CreateEditCustomer />
			</GDialog>
			<GButton 
				label='Logs'
				size='sm'
				variant='outlined'
				color='warning'
				onClick={()=>setOpenLogs(true)}
			/>
			<GDialog 
				open={openEdit}
				onClose={()=>setOpenEdit(false)}
			>
				<CreateEditCustomer row={row} />
			</GDialog>
			<GButton 
				label='Edit'
				variant='outlined'
				color='primary'
				onClick={()=>setOpenEdit(true)}
			/>
		</div>
	)
}