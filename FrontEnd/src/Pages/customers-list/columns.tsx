import React, { useEffect } from 'react'
import { GButton, GDialog, GLoading, GTable } from 'components/basic-blocks'
import { GTableColumn } from 'components/basic-blocks/g-table/types'
import moment from 'moment'
import { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CreateEditCustomer } from './create-edit-customer'
import { useStores } from 'hooks/useStores'
import { observer } from 'mobx-react'
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



const RenderActions = observer((props:any)=>{
	const {row} = props
	const [openEdit,setOpenEdit] = useState(false)
	const [openLogs,setOpenLogs] = useState(false)
	
	const {customersStore} =useStores()
	const {uploadVideo,getCustomerLogs,logs} = customersStore


	return (
		<div className='flex gap-4'>
			<GDialog
				maxWidth='2xl'
				title={`${row.name} Logs`}
				open={openLogs}
				onClose={()=>setOpenLogs(false)}
			>
				
			
				<RenderLogs id={row.id}/>
			</GDialog>
			<GButton 
				label='Logs'
				size='sm'
				variant='outlined'
				color='warning'
				onClick={()=>setOpenLogs(true)}
			/>
			<GDialog 
				title='Edit Customer'
				open={openEdit}
				onClose={()=>setOpenEdit(false)}
			>
				<CreateEditCustomer row={row} onClose={()=>setOpenEdit(false)} />
			</GDialog>
			<GButton 
				label='Edit'
				variant='outlined'
				color='primary'
				onClick={()=>setOpenEdit(true)}
			/>
			{/* <GDialog
				open={openLogs}
				onClose={()=>setOpenLogs(false)}
			>
				<CreateEditCustomer />
			</GDialog> */}
			<UploadVideoButton handleChange={handleFileChange}/>
		</div>
	)
	async function handleFileChange(files:any) {
		console.log('filesssss',files)
		if (files) {
			const selectedFile = files[0]
			if (selectedFile) {
				console.log('selectedfile',selectedFile)
				const formData = new FormData()
				formData.append('Media', selectedFile, selectedFile.name)
				await uploadVideo(formData,row.id)
			}
		}
	}
})

const RenderLogs = observer((props:any)=>{
	const {id} = props
	const {customersStore,uiStore} =useStores()
	const {getCustomerLogs,logs} = customersStore


	{console.log('Hazem ',logs) }
	useEffect(()=>{
		(async ()=>{
			await getCustomerLogs(id)
		})()
	},[])


	const columns: Array<GTableColumn<any>> = [
		{ label: 'Time', path: 'time', className: '-mr-6' ,render: (row:any) => <RenderDate row={row} />},
		{ label: 'Gate', path: 'gate', className: '-mr-6',render: (row:any) => <RenderGate row={row} /> },
		{ label: 'Plate No.', path: 'plateNumberId'},
	]

	const RenderDate = (props:any)=>{
		const {row} = props
		return (
			<div>
				{moment(row?.dateTimeTransaction).format('MMMM Do, YYYY - hh:mm:ss A')||''}
			</div>)
	}
	const RenderGate = (props:any)=>{
		const {row} = props
		return (
			<div>
				{row.isEnter?'Enterance Gate':'Exit Gate'}
			</div>)
	}
	return(
		<div>
			{uiStore.apiCallStates.getCustomerLogs==='loading' ? <GLoading />:
				<GTable
					columns={columns}
					data={logs}
					emptyString='No logs available for this user'
				/>}
		</div>
	)
})



const UploadVideoButton = (props:any) => {
	const {handleChange} = props
	const inputFileRef:any = React.useRef()

	const onFileChangeCapture = ( e: React.ChangeEvent<HTMLInputElement> ) => {
		handleChange(e.target.files)
		// console.log(e.target.files)
	}
	const onBtnClick = () => {
		/*Collecting node-element and performing click*/
		if(inputFileRef.current){
			inputFileRef.current.click()
		}
	}
	return (
		<form>
			<input
				type="file"
				ref={inputFileRef}
				onChangeCapture={onFileChangeCapture}
				style={{ display: 'none' }}
				accept="video/mp4,video/x-m4v,video/*"
			/>
			<GButton
				label='Upload Identifier video'
				variant='outlined'
				color='primary'
				onClick={()=>onBtnClick()}>Select file
			</GButton>
		</form>
	)
}