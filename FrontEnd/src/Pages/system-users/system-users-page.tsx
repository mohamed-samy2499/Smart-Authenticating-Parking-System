import { useEffect } from 'react'
import { useStores } from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { GSection, GTable } from 'components/basic-blocks'
import {columns} from './columns'
import { AddSystemUser } from './add-system-user'


export const SystemUsersPage = observer(() => {
	const { systemUsersStore,uiStore } = useStores()
	const {
		getAllSystemUsers,
		systemUsers
	} = systemUsersStore

	useEffect(() => {
		const getData = () => {
			getAllSystemUsers()
		}
		getData()
	}, [])

	return (
		<GSection 
			title="System Users"
			actions={<AddSystemUser />}
			loading={uiStore.apiCallStates.getSystemUsersState ==='loading'}
		
		>
			<GTable<any>
				columns={columns}
				data={systemUsers}
				// showHeader={false}
			/>
		</GSection>
	)
})
