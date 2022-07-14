import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { stores } from './mobx-store'
import { StoresProvider } from './mobx-store/storesProvider'
import * as serviceWorker from './serviceWorker'
import 'react-toastify/dist/ReactToastify.css'
import './app.css'
import { ToastContainer } from 'react-toastify'
import { App } from 'app'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// refetchOnWindowFocus: false, // TODO consider
		}
	}
})

ReactDOM.render(
	<React.StrictMode>
		<StoresProvider stores={stores}>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<App />
					<ToastContainer position="top-right"
						autoClose={5000}
						hideProgressBar={true}
						newestOnTop={false}
						theme={'colored'}
						className='text-sm'
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover />
				</BrowserRouter>
			</QueryClientProvider>
		</StoresProvider>
	</React.StrictMode>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
