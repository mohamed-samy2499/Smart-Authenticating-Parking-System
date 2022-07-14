import { useEffect } from 'react'

import { useStores } from '../../hooks/useStores'

import { UsersTable } from './users-table'
import { ApiCallStates } from '../../mobx-store/types'
import { observer } from 'mobx-react'
import { GLoading } from 'components/basic-blocks'

export const SystemUsers = observer(() => {
	const { systemUsersStore } = useStores()
	const {
		getAllSystemUsers,
		getSystemUsersState,
		systemUsers
	} = systemUsersStore

	useEffect(() => {
		const getData = () => {
			getAllSystemUsers()
		}
		getData()
	}, [])
	if (getSystemUsersState === ApiCallStates.LOADING)
		return <GLoading />
	console.log(systemUsers)
	return <UsersTable customersArray={systemUsers} />
})
