import { Routes ,Route} from 'react-router'
import { observer } from 'mobx-react'
import './app.css'
import { MainPage } from 'Pages/main-page'
import { useStores } from 'hooks/useStores'
import { GModal } from 'components/basic-blocks'
import http from 'Services/httpService'
import { useEffect } from 'react'

export const App = observer(() => {
	const { uiStore,authStore } = useStores()
	const { modalContent} = uiStore
	const {getAccessToken,logout ,getUserData} = authStore

	useEffect(() => {
		(async () => {
			const token = await getAccessToken()
			http.setLogoutListener(logout)
			if (token) {
				await getUserData()
			}
		})()
	},[])


	return (
		<div className="App">
			<GModal {...modalContent} />
			<Routes>		
				<Route path="*" element={	<MainPage /> } />	
			</Routes>
		</div>
	)
})
