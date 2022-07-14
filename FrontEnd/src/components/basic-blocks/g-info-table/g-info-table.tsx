import { classNames } from 'utils'

export const InfoItemGroup = (props: { title: string, className?: string, children: any }) => {
	return (
		<>
			<dl className={classNames('sm:divide-y sm:divide-gray-200 border-b border-t border-gray-200 -mx-6 bg-gray-50', props.className || '')}>
				<div className="py-2 sm:py-4 px-6">
					<dt className="text-sm font-medium text-gray-700">{props.title}</dt>
				</div>
			</dl>

			<dl className="sm:divide-y sm:divide-gray-200 -mx-6 text-xs">
				{props.children}
			</dl>
		</>
	)
}

export const InfoItem = (props: { label: string, children: any, className?: string }) => {
	return (
		<div className={classNames('py-2 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 px-6', props.className || '')}>
			<dt className="font-medium text-gray-500">{props.label}</dt>
			<dd className="mt-1 font-medium text-gray-700 sm:mt-0 sm:col-span-2">
				{props.children}
			</dd>
		</div>
	)
}