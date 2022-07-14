import { observer } from 'mobx-react'

import { AdminMenu } from './menus'

import { GSlideOver, GTransition } from 'components/basic-blocks'
import { useStores } from 'hooks/useStores'

export const Sidebar = observer(() => {
	const { uiStore } = useStores()
	const { context, mobileSidebarOpen, setMobileSidebarOpen } = uiStore

	const menuContent = (
		<>
			<GTransition show={context === 'admin'} swap>
				{/* <GTransition show={true} swap> */}
				<AdminMenu />
			</GTransition>
		</>
	)

	return (
		<>
			<div className="hidden md:flex md:flex-col md:fixed md:top-16 md:inset-y-0 flex-grow-0 bg-gray-800  relative z-20">
				<div className="w-64 p-4 z-50 overflow-y-auto overflow-x-hidden">
					{menuContent}
				</div>
			</div>
			<div className="flex md:hidden">
				<GSlideOver open={mobileSidebarOpen} setOpen={setMobileSidebarOpen}>
					<div className="w-72 px-4 -z-50 overflow-auto overflow-x-hidden bg-gray-800">
						{menuContent}
					</div>
				</GSlideOver>
			</div>
		</>
	)
})

//
