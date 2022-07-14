import { useStores } from 'hooks/useStores'
import { Navbar } from 'Layouts/navbar'
import { Sidebar } from 'Layouts/sidebar'
// import { Sidebar } from 'Layouts/sidebar'


export const AdminLayout = props => {

	const { children } = props
	const { uiStore } = useStores()
	const { sidebarCollapsed } = uiStore

	return (
		<div>
			<div className={'flex flex-col'}>
				<Navbar />
				<div className='flex min-h-[calc(100vh-4rem)]'>
					<main className={`flex-1 overflow-hidden py-8 px-12 ${sidebarCollapsed ? 'md:ml-12' : 'md:ml-64'}`}>
						{children}
					</main>
					<Sidebar />
				</div>
			</div>
		</div>
	)



	// return (
	// 	<React.Fragment>
	// 		<Box sx={{ display: 'flex' }}>
	// 			<AdminNavigator />
	// 			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
	// 				<Toolbar />
	// 				<div>{props.children}</div>
	// 			</Box>
	// 		</Box>
	// 	</React.Fragment>
	// )
}
