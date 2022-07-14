
import { GLoading } from 'components/basic-blocks'
import { useStores } from 'hooks/useStores'
import { AdminLayout } from 'Layouts'
import { observer } from 'mobx-react'
import { Outlet} from 'react-router-dom'

export const AdminBase = observer(() => {
	const { authStore } = useStores()
	const {user} = authStore

	if(!user) return <GLoading />

	return (
		<AdminLayout className="AdminAppWrapper">
			<Outlet />
		</AdminLayout>
	)
})