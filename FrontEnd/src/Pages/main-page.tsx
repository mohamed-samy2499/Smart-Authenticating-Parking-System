
import { useEffect } from 'react'
import { Routes } from 'react-router'
import { Route } from 'react-router-dom'
import { useStores } from '../hooks/useStores'
import { observer } from 'mobx-react'
import { AdminBase } from 'Pages/adminbase'
import { Control, CreateEditCar, CreateEditCustomer, CreateEditSystemUser, CustomerPage, SystemUsersPage, UserProfile, LoginPage, CarsPage } from 'Pages'

export const MainPage = observer(() => {
	const { authStore } = useStores()
	const { isUserLoggedIn } = authStore

	if (!isUserLoggedIn()) {
		return <LoginPage />
	}
	
	return (
		<Routes>
			<Route path="/" element={<AdminBase />}>
				<Route index element={<CustomerPage />} />
				<Route path="profile"  element={<UserProfile/>} />
				<Route path="system-users"  element={<SystemUsersPage/>} />
				<Route path="system-users/new"	element={<CreateEditSystemUser/>}	/>
				<Route path="system-users/edit" element={<CreateEditSystemUser/>}/>
				<Route path="customers"  element={<CustomerPage/>} />
				<Route path="customers/new" element={<CreateEditCustomer/>} />
				<Route path="customers/edit" element={<CreateEditCustomer/>} />
				<Route path="cars"  element={<CarsPage/>} />
				<Route path="cars/new"  element={<CreateEditCar/>} />
				<Route path="cars/edit"  element={<CreateEditCar/>} />
				<Route path="control"  element={<Control/>} />
			</Route>
		</Routes>	
	)

	

	
})
