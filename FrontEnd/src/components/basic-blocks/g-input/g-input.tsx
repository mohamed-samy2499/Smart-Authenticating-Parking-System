import { GInputProps } from './types'

export const GInput = (props: GInputProps) => {
	const { value, onChange: handleChange, type = 'text', label, placeholder, name, id, ariaDescribedby, helpText, error, icon: Icon, iconPosition = 'start', dropdownOptions, style, className, ref,checked,disabled } = props
	return (
		<div className={`${className} relative`}>
			{label && <label htmlFor={label} className="text-left block text-sm font-medium text-gray-700 mb-1">
				{label}
			</label>}
			<div className="rounded-md shadow-inner">
				<input
					ref={ref}
					type={type}
					name={name}
					value={value}
					id={id}
					className={`disabled:bg-gray-100 shadow-inner h-full focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md placeholder:text-sm placeholder:italic placeholder:text-gray-400 ${Icon ? 'pl-10' : ''} }`}
					placeholder={placeholder}
					aria-describedby={ariaDescribedby}
					onChange={(e) => handleChange(e)}
					checked={checked}
					disabled={disabled}
				/>

				{Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Icon className="h-4 w-4 text-gray-400" aria-hidden="true" />
				</div>}
			</div>
			{error &&
				<p className="mt-1 text-sm text-danger-500" id="email-description">{error}</p>
			}
			{helpText &&
				<p className="mt-2 text-sm text-gray-500" id="email-description">
					{helpText}
				</p>}
		</div >
	)
}

