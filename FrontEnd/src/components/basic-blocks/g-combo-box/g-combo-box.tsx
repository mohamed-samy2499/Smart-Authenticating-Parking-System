import { useState } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Combobox } from '@headlessui/react'
import { classNames } from 'utils'

type option<T> = {
	icon?:any,
	key?:string,
}

interface GComboBoxProps<T>{
	options: any[]
	value:any
	label:string
	name?:string
	onChange: (e: any) => void
	disabled?:boolean
}

export const GComboBox = <T,>(props:GComboBoxProps<T>) => {
	const { options,value,onChange,label ,disabled} = props
	const [query, setQuery] = useState('')

	const filteredOptions =
    query === ''? options: options.filter((option:any) => (option.trim().toLowerCase().includes(query.toLowerCase())))

	return (
		<Combobox as="div" value={value} onChange={(e)=>onChange(e)} disabled={disabled}>
			{label &&	<Combobox.Label className="block text-sm font-medium text-gray-700">{label}</Combobox.Label>}
			<div className="relative mt-1">
				<Combobox.Input
					disabled={true}
					className="disabled:bg-gray-100 w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
					onChange={(event) => setQuery(event.target.value)}
					displayValue={ (option:any) => option}
				/>
				<Combobox.Button className="disabled:bg-gray-100 absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
					<SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
				</Combobox.Button>

				{filteredOptions.length > 0 && (
					<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{filteredOptions.map((option:any,i:number) => (
							<Combobox.Option
								key={i}
								value={option}
								className={({ active }) =>
									classNames(
										'relative cursor-default select-none py-2 pl-3 pr-9',
										active ? 'bg-primary-600 text-white' : 'text-gray-900'
									)
								}
							>
								{({ active, selected }) => (
									<>
										<div className="flex items-center">
											{/* {	option.icon && <span
												className={classNames(
													'inline-block h-2 w-2 flex-shrink-0 rounded-full',
												)}

												aria-hidden="true"
											>
												<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
													<option.Icon className="h-4 w-4 text-gray-400" aria-hidden="true" />
												</div>
											</span>} */}
											<span className={classNames('ml-3 truncate', `${selected && 'font-semibold'}`)}>
												{option}
												{/* <span className="sr-only"> is {option.online ? 'online' : 'offline'}</span> */}
											</span>
										</div>

										{selected && (
											<span
												className={classNames(
													'absolute inset-y-0 right-0 flex items-center pr-4',
													active ? 'text-white' : 'text-primary-600'
												)}
											>
												<CheckIcon className="h-5 w-5" aria-hidden="true" />
											</span>
										)}
									</>
								)}
							</Combobox.Option>
						))}
					</Combobox.Options>
				)}
			</div>
		</Combobox>
	)
}
