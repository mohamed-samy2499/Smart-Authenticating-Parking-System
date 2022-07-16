import { useEffect, useState } from 'react'
import { useStores } from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { GButton, GDialog, GLoading, GSection, GTable } from 'components/basic-blocks'
import {columns} from './columns'
import { CreateEditCustomer } from './customer-table/create-edit-customer'

export const CustomerPage = observer(() => {
	const { customersStore } = useStores()
	const { getAllCustomers, customers } = customersStore

	useEffect(() => {
		const getData = () => {
			getAllCustomers()
		}
		getData()
	}, [])
	if(!customers) return <GLoading />
	return (
		<GSection 
			title="Customers"
			actions={<AddCustomer />}
			
		
		>
			<GTable<any>
				columns={columns}
				data={customers}
			/>
		</GSection>
	)

	function AddCustomer(){
		const [openEdit,setOpenEdit] = useState(false)
		return(
			<>
				<GDialog
					open={openEdit}
					onClose={()=>setOpenEdit(false)}
				>
					<CreateEditCustomer onClose={()=>setOpenEdit(false)} />
				</GDialog>
				<GButton 
					label='Create Customer'
					size='sm'
					variant='contained'
					color='primary'
					onClick={()=>setOpenEdit(true)}
				/>
			</>
		)
	}
})