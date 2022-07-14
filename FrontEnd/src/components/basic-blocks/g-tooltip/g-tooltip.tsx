import { usePopper } from 'react-popper'
import { useState } from 'react'
import { Transition } from '@headlessui/react'
import { GTransition } from '../g-transition'

interface GTooltipProps {
	position?: 'bottom' | 'left' | 'right' | 'top'
	content: JSX.Element | Element | string
	children: JSX.Element | Element
}

export const GTooltip = (props: GTooltipProps) => {
	const {
		position = 'bottom',
		content,
		children
	} = props

	const [show, setShow] = useState(false)

	const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
	const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
	const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null)
	const { styles, attributes, state } = usePopper(referenceElement, popperElement, {
		placement: position,
		modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
	})

	return (
		<div className='group'>
			<div
				ref={setReferenceElement}
				className='cursor-pointer'
				onMouseEnter={() => setShow(true)}
				onClick={() => setShow(true)}
				onMouseLeave={() => setShow(false)}
			>
				{children}
			</div>

			<div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
				<GTransition show={show}>
					<div
						className='bg-white shadow-lg px-4 py-2 rounded-lg border text-xs'
						onClick={() => setShow(false)}>
						{content}
					</div>
					<div ref={setArrowElement} style={styles.arrow} />
				</GTransition>
			</div>
		</div>
	)
}