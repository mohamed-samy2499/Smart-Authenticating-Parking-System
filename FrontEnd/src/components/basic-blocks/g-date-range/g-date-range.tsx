import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import { useState } from 'react'
import { DateRange, Calendar } from 'react-date-range'
import moment from 'moment'
import { classNames } from 'utils'

import { Popover } from '@headlessui/react'
import { GButton, GTransition } from '..'

import { GDateRangeProps, Options } from './types'
import { ranges, options } from './constants'
import { RiArrowDownSLine } from 'react-icons/ri'



export const GDateRange = (props: GDateRangeProps) => {
	const { onChange, label, buttonLabel, align = 'left', variant, color, className } = props
	const [value, setValue] = useState<Options>('Last 30 days')
	const [range, setRange] = useState({ startDate: moment().subtract(30, 'days').toDate(), endDate: new Date(), key: 'selection' })
	const [openCalendar, setOpenCalendar] = useState(false)

	const internalButtonLabel = value === 'Custom' ? `${range.startDate.toLocaleDateString()} - ${range.endDate.toLocaleDateString()}` : value
	return (
		<>
			<div className='flex'>
				<div>
					{label && <div className="block text-sm font-medium text-gray-700" mb-1>{label}</div>}
					<Popover className="flex relative w-full flex-col z-10">
						{({ open }) => (
							<>
								<Popover.Button as='div'>
									<GButton
										variant={variant || 'contained'}
										color={color || 'neutral'}
										label={buttonLabel || internalButtonLabel}
										icon={RiArrowDownSLine}
									/>
								</Popover.Button>
								<GTransition show={open}>
									<Popover.Panel className={`absolute top-1  ${align === 'left' ? 'left-0' : 'right-0'}`}>
										<div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
											<div className='flex justify-start'>
												<div className="relative grid gap-1 bg-white px-5 py-2">
													<div>
														{options.map((option, index) => (
															<li key={index} className={`list-none flex items-center cursor-pointer justify-start truncate -mx-5 px-4 py-3 hover:bg-gray-50 ${value === option && 'bg-gray-100'} ${option === 'Custom' && 'border-t'}`} onClick={() => handlePeriodChange(option)}>
																<p className="text-sm font-medium text-gray-700 truncate">{option}</p>
															</li>
														)
														)}
													</div>
												</div>
												<div className='flex-1 bg-white'></div>
												<GTransition show={openCalendar}>
													<DateRange
														ranges={[range]}
														onChange={handleSelect}
													/>
												</GTransition>
											</div>

										</div>
									</Popover.Panel>
								</GTransition>
							</>
						)}
					</Popover>
				</div>
				<div className='flex-1'></div>
			</div>
		</>
	)


	function handlePeriodChange(option: Options) {
		setValue(option)
		setRange(ranges[option])

		if (onChange) {
			onChange({
				from: ranges[option].startDate,
				to: ranges[option].endDate
			})
		}

		if (option === 'Custom') {
			setOpenCalendar(true)
			return
		}
		setOpenCalendar(false)
	}

	function handleSelect(ranges: any) {
		const { startDate, endDate, key } = ranges.selection

		if (onChange) {
			onChange({
				from: startDate,
				to: endDate
			})
		}
		setRange({
			startDate: startDate,
			endDate: endDate,
			key: key
		})
	}
}