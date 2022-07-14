import { usePopper } from 'react-popper'
import { Children, Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import { GLoading } from '../g-loading'

export const GTransition = (props: { show: boolean, loader?: boolean, swap?: boolean, children: any }) => {
	if (!props.show && props.loader) {
		return <GLoading />
	}
	return (
		<Transition
			show={props.show}
			as={'div'}
			enter="transition ease-out duration-200"
			enterFrom="opacity-0 translate-y-1"
			enterTo="opacity-100 translate-y-0"
			leave={props.swap ? undefined : 'transition ease-in duration-0'}
			leaveFrom={props.swap ? undefined : 'opacity-100 translate-y-0'}
			leaveTo={props.swap ? undefined : 'opacity-0 translate-y-1'}
		>
			{props.children}
		</Transition>
	)
}