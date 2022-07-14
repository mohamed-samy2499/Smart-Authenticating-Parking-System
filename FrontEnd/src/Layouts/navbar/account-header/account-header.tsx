
import { NavLink} from 'react-router-dom'
import { observer } from 'mobx-react'
import { useStores } from 'hooks/useStores'
import { GTransition } from 'components/basic-blocks'
import {FaParking } from 'react-icons/fa'

export const AccountHeader = observer(() => {
	const {  uiStore } = useStores()
	const { context } = uiStore

	return (
		<>
			<GTransition show={context === 'admin'} swap>
				<div className='flex w-64 items-center space-x-4 mx-8 py-2'>
					<NavLink to='/'>
						<div className='flex gap-2 items-center justify-start'>
							<FaParking  className='w-12 h-12 text-primary-500' />
							<p className='text-lg text-primary-500'>Parking System</p>
						</div>
					</NavLink>
				</div>
			</GTransition>
		</>
	)
})



