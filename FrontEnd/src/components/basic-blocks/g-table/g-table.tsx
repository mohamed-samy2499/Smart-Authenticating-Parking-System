import { TableHeader } from './table-header'
import { TableBody } from './table-body'
import { GPagination } from './g-pagination'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { GTableProps, GTableState } from './types'

export function GTable<T>(props: GTableProps<T>) {
	const { columns, data, pageSize, showHeader = true, rowClassName } = props

	const [state, setState] = useState<GTableState>({
		page: 1,
		sortPath: null,
		sortOrder: 'desc'
	})

	const sortedData = state.sortPath ? _.orderBy(data, [state.sortPath], state.sortOrder) : data

	const paginatedData = pageSize ? pagination(sortedData, state.page, pageSize) : sortedData

	useEffect(() => {
		handlePageChange(1)
	}, [data])

	const handleSort = (path: string, order: 'asc' | 'desc') => {
		setState({ ...state, sortPath: path, sortOrder: order })
	}

	const handlePageChange = (page: number) => {
		setState({ ...state, page })
	}

	if (data.length <= 0) {
		return (
			<div className='text-center py-4'>
				<span className='text-sm text-gray-500'>Nothing to show here</span>
			</div>
		)
	}

	return (
		<div className="mb-1 flex flex-col">
			<div className="-my-4 overflow-x-auto -mx-4 sm:-mx-5 lg:-mx-6">
				<div className="inline-block min-w-full py-2 align-middle">
					<table className="min-w-full table-auto divide-y divide-gray-200">
						{showHeader && <TableHeader columns={columns} sort={{ path: state.sortPath, order: state.sortOrder }} onSort={handleSort} />}
						<TableBody columns={columns} data={paginatedData} showDivider={showHeader} rowClassName={rowClassName} />
					</table>
				</div>
			</div >
			{pageSize &&
				<GPagination
					itemsCount={data.length}
					pageSize={pageSize}
					currentPage={state.page}
					onPageChange={handlePageChange}
				/>}
		</div >
	)
}

function pagination(items: any, pageNumber: number, pageSize: number) {
	const startIndex = (pageNumber - 1) * pageSize
	return _(items)
		.slice(startIndex)
		.take(pageSize)
		.value()
}
