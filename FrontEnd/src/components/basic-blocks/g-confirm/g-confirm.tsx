import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { RiErrorWarningLine, RiInformationLine } from 'react-icons/ri'
import { classNames } from 'utils'
import { GButton } from '../g-button'
import { GDialog } from '../g-dialog'
import { GConfirmProps } from './types'


export const GConfirm = (props: GConfirmProps) => {
	const [openState, setOpenState] = useState(false) 
	const	{
		open=openState,
		setOpen=setOpenState,
		type = 'primary',
		children,
		title,
		description,
		icon:Icon = RiInformationLine,
		confirmLabel,
		onConfirm ,
		loading
	} = props
	
	return (
		<div>
			<div onClick={() => setOpen(true)}>
				{children}
			</div>
			<GDialog open={open} onClose={() => setOpen(false)} showClose={false}>
				<div className={classNames('mx-auto flex items-center justify-center h-12 w-12 rounded-full', `bg-${type}-100`)}>
					<Icon className={`h-6 w-6 text-${type}-500`} aria-hidden="true" />
				</div>
				<div className="mt-3 text-center sm:mt-5">
					<Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
						{title}
					</Dialog.Title>
					<div className="mt-2">
						<p className="text-sm text-gray-500">
							{description}
						</p>
					</div>
				</div>
				<div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
					<GButton onClick={() => setOpen(false)} variant='text'>Cancel</GButton>
					<GButton color={type} onClick={onConfirm} loading={loading} >
						&nbsp;&nbsp;{confirmLabel || 'Confirm'}&nbsp;&nbsp;
					</GButton>
				</div>
			</GDialog >
		</div >
	)
}