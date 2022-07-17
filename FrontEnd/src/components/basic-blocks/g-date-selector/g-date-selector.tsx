
import { Popover } from '@headlessui/react'
import { useState } from 'react'
import { Calendar, CalendarProps } from 'react-date-range'
import { RiArrowDownSLine } from 'react-icons/ri'
import { classNames } from 'utils'
import { GButton } from '../g-button'
import { GbuttonProps } from '../g-button/types'
import { GTransition } from '../g-transition'

interface GDateSelectorProps extends CalendarProps {
	onChange: (e: Date) => void,
	align?: 'left' | 'right'
	label?: string,
	variant?: GbuttonProps['variant']
	color?: GbuttonProps['color']
	className?: string
	buttonLabel?: string
}

export const GDateSelector = (props: GDateSelectorProps) => {
	const { onChange, label, buttonLabel, align = 'left', variant, color, className, ...rest } = props
	const [date, setDate] = useState(new Date())
	const buttonTitle = date ? date.toLocaleDateString() : (buttonLabel || 'Select Date')

	return (
		<>				<div>

			{label && <div className="block text-sm font-medium text-gray-700 mb-1">{label}</div>}
			<Popover className="flex relative w-full flex-col z-10">
				{({ open }) => (
					<>
						<Popover.Button as='div'>
							<GButton
								variant={variant || 'contained'}
								color={color || 'neutral'}
								label={buttonTitle}
								icon={RiArrowDownSLine}
								className={className}
							/>
						</Popover.Button>
						<GTransition show={open}>
							<Popover.Panel className={`absolute top-1  ${align === 'left' ? 'left-0' : 'right-0'}`}>
								<Calendar
									date={date}
									onChange={item => handleDateChange(item)}
									{...rest}
								/>
							</Popover.Panel>
						</GTransition>
					</>
				)}
			</Popover>
		</div>
		<div className='flex-1'></div>
	
		</>
	)
	function handleDateChange(item: any) {
		if (onChange) {
			onChange(item)
		}
		setDate(item)
	}
}


