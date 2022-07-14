import { RiNotification3Line } from 'react-icons/ri'

export const Notifications = () => {

	// TODO poll notifications
	// maybe from userStore? idk
	return (
		<div className='text-gray-200 cursor-pointer rounded-full hover:bg-primary-800 p-2'>
			<RiNotification3Line className='h-4 w-4 text-gray-200' />
		</div>
	)
}