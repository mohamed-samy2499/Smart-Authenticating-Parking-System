/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from 'react'
import { Transition, Popover } from '@headlessui/react'
import { classNames } from 'utils'
import { GSlideOver } from '../g-slide-over'



export function Gdropdown(props: any) {
	// const { accountStore, uiStore } = useStores()
	// const { account, accounts } = accountStore

	const { menuButton, content: Content, responsive } = props
	const [open, setOpen] = useState(false)

	if (responsive) return (
		<>
			<div onClick={() => setOpen(true)} className='w-full'>
				{menuButton}
			</div>
			<GSlideOver position="right" open={open} setOpen={setOpen} className='flex md:hidden z-51 '>
				<div className={classNames('absolute z-10 px-0 mt-0 transform sm:px-0 w-min whitespace-nowrap', props.anchor === 'right' ? 'right-0' : '', props.anchor === 'left' ? 'left-0' : '')}>
					<Content />
				</div>
			</GSlideOver>
		</>
	)
	return (
		<div className="w-full ">
			<Popover className="relative max-w-full">
				{({ open, close }) => (
					<>
						<Popover.Button className={classNames('w-full transition-colors ', open ? '' : '')}>
							{menuButton}
						</Popover.Button>
						<Transition
							as={'div'}
							enter="transition ease-out duration-200"
							enterFrom="opacity-0 translate-y-1"
							enterTo="opacity-100 translate-y-0"
							leave="transition ease-in duration-150"
							leaveFrom="opacity-100 translate-y-0"
							leaveTo="opacity-0 translate-y-1"
						>
							{open &&
								<Popover.Panel className={classNames('absolute z-10 px-0 mt-0 transform sm:px-0 w-min whitespace-nowrap', props.anchor === 'right' ? 'right-0' : '', props.anchor === 'left' ? 'left-0' : '')}>
									{/* <Popover.Button> */}

									{/* {({ close }) => (
										<button
										onClick={async () => {
											await fetch('/accept-terms', { method: 'POST' })
											close()
											}}
											>
											Read and accept
											</button>
										)} */}
									<Content close={close} />
									{/* </Popover.Button> */}
								</Popover.Panel>
							}
						</Transition>
					</>
				)}
			</Popover>
		</div>
	)
}
export function GNestedDropDown(props: any) {
	const { content } = props
	const [menuOpen, setMenuOpen] = useState(false)
	return (
		<>
			<div className='w-full h-full top-0 bg-transparent absolute' onMouseEnter={() => handleOnMouseEnter()} onMouseLeave={() => handleOnMouseLeave()}>
				<ul className={`${menuOpen ? 'block' : 'hidden'} absolute w-auto whitespace-nowrap bg-white left-full mt-1 rounded-lg -top-0 p-4 shadow-lg`}>
					{content}
				</ul>
			</div>
		</>

	)

	function handleOnMouseEnter() {
		setMenuOpen(true)
	}
	function handleOnMouseLeave() {
		setMenuOpen(false)
	}

}