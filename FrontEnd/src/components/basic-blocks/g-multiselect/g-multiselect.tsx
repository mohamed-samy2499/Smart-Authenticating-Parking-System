import { useState, useEffect, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline'
import { GMultiSelectPropsType } from './types'
import { Country } from 'country-data'

const classNames = (...classes:any) => {
	return classes.filter(Boolean).join(' ')
}

export function GMultiSelect<T>(props: GMultiSelectPropsType<T>) {
	const { value, options, loopKey, onChange, renderSelected, renderLabel, label, className, error, placeholder, disabled } = props

	const [selectedItems, setSelectedItems] = useState<Array<any>>(value === undefined ? [] : value)
	return (
		<>
			<Listbox 
				value={selectedItems} 
				onChange={(e) => {
					setSelectedItems(e) 
					onChange(e)}} 
				disabled={disabled}
				multiple>

				{({ open }) => (
					<div className={className}>
						<div className="mt-1 relative">
							<Listbox.Label className="block text-sm font-medium text-gray-700">{label}</Listbox.Label>
							<Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-success-500 focus:border-success-500 sm:text-sm">
								<span className="block truncate">
									{selectedItems && selectedItems.length > 0 ? renderSelected(selectedItems) : placeholder}
								</span>
								<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
									<SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</span>
							</Listbox.Button>
							<Transition
								show={open}
								as={Fragment}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
									{options.map((option, i) => (
										<Listbox.Option 
											key={i} 
											value={loopKey ? option[loopKey] : option}
											className={({ active }) =>
												classNames(
													active ? 'text-white bg-success-500' : 'text-gray-900',
													'cursor-default select-none relative py-2 pl-3 pr-9'
												)
											}
										>
											{({ selected, active }) => (
												<>
													<div className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
														{renderLabel(option)}
													</div>
													{selected ? (
														<span
															className={classNames(
																active ? 'text-white font-semibold' : 'text-success-600',
																'absolute inset-y-0 right-0 flex items-center pr-4'
															)}
														>
															<CheckIcon className="h-5 w-5" aria-hidden="true" />
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
						</div>
					</div>
				)}
			</Listbox>
			{error &&
				<p className="mt-1 text-sm text-danger-500">{error}</p>
			}
		</>
	)
}