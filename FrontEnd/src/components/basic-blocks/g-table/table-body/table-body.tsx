import _ from 'lodash'
import { classNames } from 'utils'
import { GTableBodyProps, GTableColumn } from '../types'

export function TableBody<T>(props: GTableBodyProps<T>) {
	const { data, columns, showDivider, rowClassName } = props

	const renderCell = (item: T, column: GTableColumn<T>) => {
		if (column.render) return column.render(item)
		if (column.path) return _.get(item, column.path)
		return <span className='text-xs text-gray-500'>N/A</span>
	}

	// const renderColumnCss = (item: any, column: any) => {
	// 	if (column.rowStyles) return (column?.rowStyles(item))
	// 	return ''
	// }

	if (data.length <= 0) return (
		<tbody className={classNames('bg-white py-4', showDivider ? 'divide-y divide-gray-200' : '')}>
			<tr>
				<td className='text-center' colSpan={1000}>
					<span className='text-sm text-gray-500'>Nothing to show here</span>
				</td>
			</tr>
		</tbody >
	)

	// console.log('TableBodydata', data)
	// console.log('TableBodycolumn', columns)
	return (
		<tbody className={classNames(showDivider ? 'divide-y divide-gray-200' : '')}>
			{data.map((item: T, i: number) => (
				<tr key={`table-row-${i}`} className={rowClassName ? rowClassName(item) : ''}>
					{columns.map((column: GTableColumn<T>, index: number) => (
						<td
							className={classNames(
								'whitespace-nowrap px-4 py-4 text-sm text-gray-500',
								column.expand ? 'w-full' : 'whitespace-nowrap',
								column.mobileHide ? 'hidden md:table-cell' : '',
								column.tabletHide ? 'hidden lg:table-cell' : ''

							)}
							key={`table-column-${index}`}
						>
							<div className={classNames('flex w-full h-full px-2', column.className || '')} >
								{renderCell(item, column)}
							</div>
						</td>
					))}
				</tr>
			))
			}
		</tbody >
	)
}
