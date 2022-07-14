import { useState } from 'react'
import { Popover } from '@headlessui/react'
import { GSlideOver } from '../g-slide-over'
import { usePopper } from 'react-popper'
import { GTransition } from '../g-transition'


export function GSwitcher(props: any) {
	const { selectedItem, header: Header, body: Body, footer, responsive = false } = props
	const [open, setOpen] = useState(false)
	const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
	const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
	const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
		placement: 'right-start'
	})

	if (responsive) return (
		<>
			<div className="w-full" onClick={() => { setOpen(true) }}>
				{selectedItem}
			</div>
			<GSlideOver position="right" open={open} setOpen={setOpen} className='flex md:hidden z-51 '>
				<div className='w-72 p-4 z-50 overflow-y-auto overflow-x-hidden'>
					<div className="flex flex-col">
						<div className="flex-1 flex flex-col">
							<Header />
							<div className="flex-1 flex flex-col mb-2">
								<Body />
							</div>
							{footer && <div className="flex border-t">
								{footer}
							</div>}
						</div>
					</div>
				</div>
			</GSlideOver>
		</>
	)

	return (
		<Popover>
			{({ open, close }) => (
				<>
					<Popover.Button as='div' className="w-full">
						<div ref={setReferenceElement} className="w-full">
							{selectedItem}
						</div>
					</Popover.Button>
					<Popover.Panel ref={setPopperElement} style={styles.popper} {...attributes.popper} className='bg-white border rounded-lg shadow-lg absolute z-20 top-0 -right-4 -mr-72 ml-2'>
						<GTransition show={true}>
							<div className="flex flex-col">
								<div className="flex-1 flex flex-col">
									<Header close={close} />
									<div className="flex-1 flex flex-col mb-2">
										<Body close={close} />
									</div>
									{footer && <div className="flex border-t">
										{footer}
									</div>}
								</div>
							</div>
						</GTransition>
						<div ref={setArrowElement} style={styles.arrow} />
					</Popover.Panel>
				</>
			)}
		</Popover>
	)
}