import { RiCheckboxBlankCircleFill, RiLoader3Line, RiLoader4Line, RiLoader5Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { classNames } from 'utils'
import { GNoticeProps } from './types'

export const GNotice = ({ content, title, icon, color, link, actions }: GNoticeProps) => {
	const navigate = useNavigate()

	const textColor = () => {
		if (!color || color === 'neutral') return 'text-gray-600'
		return `text-${color}-600`
	}
	const bgColor = () => {
		if (!color || color === 'neutral') return 'bg-gray-50'
		return `bg-${color}-100`
	}
	const borderColor = () => {
		if (!color || color === 'neutral') return 'border-gray-400'
		return `border-${color}-400`
	}

	const Icon = icon
	return (
		<div className={classNames('rounded-md p-4 border-l-4', bgColor(), borderColor())}>
			<div className="flex items-center" >
				{icon && <div className="h-full self-stretch">
					<Icon className={classNames('h-5 w-5', textColor())} aria-hidden="true" />
				</div>}
				<div className="ml-2 flex flex-col space-y-1 flex-1">
					{title && <h3 className={classNames('text-sm font-medium', textColor())}>{title}</h3>}
					<div className={classNames('text-sm', textColor())}>
						{content}
					</div>
					{actions && <div className="pt-2 w-full">
						<div className="-mx-2 -my-1.5 flex flex-row-reverse">
							{actions}
						</div>
					</div>}
				</div>
				{link && <p className="text-sm md:mt-0 md:ml-6">
					<a href="#" onClick={() => navigate(link.to)} className={classNames('whitespace-nowrap font-medium', textColor())}>
						{link.label} <span aria-hidden="true">&rarr;</span>
					</a>
				</p>}
			</div >
		</div >

	)
}