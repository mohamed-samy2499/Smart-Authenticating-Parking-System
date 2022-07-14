import { RiCheckboxBlankCircleFill, RiLoader3Line, RiLoader4Line, RiLoader5Line } from 'react-icons/ri'
import { classNames } from 'utils'

export const GLoading = (props: any) => {
	const { label } = props
	return (
		<div
			className={
				classNames('w-full h-full flex flex-col items-center justify-center p-4 m-6')
			}>
			<RiCheckboxBlankCircleFill className='absolute w-10 h-10 animate-pulse text-primary-100' />
			<RiLoader5Line className='absolute w-8 h-8 animate-spin text-primary-500' />
		</div>
	)
}