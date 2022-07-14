
import { Listbox, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { RiArrowDownSLine, RiCheckLine } from 'react-icons/ri'
import { classNames } from 'utils'
import { GListboxProps } from './types'

export function GListbox<T>(props: GListboxProps<T>) {
	const { options, value, onChange, renderLabel, label, className, error, helpText, placeholder, disabled } = props

	return (
		<div className={className}>
			<Listbox value={value} onChange={onChange} disabled={disabled}>
				{({ open }) => (
					<>
						<Listbox.Label className="block text-sm font-medium text-gray-700">{label}</Listbox.Label>
						<div className="mt-1 relative z-10">
							<Listbox.Button className="disabled:bg-gray-100 relative w-full bg-white hover:bg-gray-50 border rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm cursor-pointer">
								<span className="w-full truncate">
									{value ? renderLabel(value) : placeholder}
								</span>
								<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
									<RiArrowDownSLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</span>
							</Listbox.Button>

							<Transition
								show={open}
								as={Fragment}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<Listbox.Options className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
									{options.map((option, i) => (
										<Listbox.Option
											key={'key' + i}
											className={({ active }) =>
												classNames(
													active ? 'text-gray-900 bg-gray-100' : 'text-gray-700',
													'cursor-default select-none relative py-2 pl-3 pr-9'
												)
											}
											value={option}
										>
											{({ selected, active }) => (
												<>
													<div className="flex">
														{renderLabel(option)}
													</div>

													{selected ? (
														<span
															className={classNames(
																active ? 'text-primary-600' : 'text-primary-500',
																'absolute inset-y-0 right-0 flex items-center pr-4'
															)}
														>
															<RiCheckLine className="h-5 w-5" aria-hidden="true" />
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
						</div>
					</>
				)}
			</Listbox>
			{error &&
				<p className="mt-1 text-sm text-danger-500">{error}</p>
			}
		</div>
	)

}