
import { GSelectProps } from './types'

export const GSelect = (props: GSelectProps) => {
	const { options, name, value, onChange, label, className, error, helpText, placeholder } = props

	return (
		<div>
			{label && <label htmlFor={name} className="block text-sm font-medium text-gray-700">
				{label}
			</label>}
			<div className="relative rounded-md shadow-inner">
				<select
					id={name}
					name={name}
					className={`${className} ${!value ? 'text-gray-400 italic' : 'text-gray-700'} shadow-inner h-full focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md placeholder:text-sm placeholder:italic placeholder:text-gray-200 `}
					value={value}
					onChange={(e) => onChange(e)}
				>
					<option value="" hidden className='text-gray-400'>{placeholder}</option>
					{options && options.map((option) => {
						const {label,value} = option
						return (
							<option className='text-black' key={`${value}${Math.random()}`} value={option.value}> {label}</option>
						)
					}
					)}

				</select>
			</div>
			{error &&
				< p className="mt-1 text-sm text-danger-500" id="email-description">{error}	</p>
			}
			{helpText &&
				< p className="mt-2 text-sm text-gray-500" id="email-description">
					{helpText}
				</p>}
		</div>
	)

}