import React, { Component, useState } from 'react'
import { ArrowSmUpIcon, ArrowSmDownIcon } from '@heroicons/react/outline'
import { classNames } from 'utils'
import { GTableColumn, GTableHeaderProps } from '../types'
import { RiArrowDownSLine, RiArrowUpSLine, RiCodeLine } from 'react-icons/ri'

export function TableHeader<T>(props: GTableHeaderProps<T>) {
	const { columns, sort, onSort } = props

	const raiseSort = (column: GTableColumn<T>) => {
		const path = column.path
		if (!path) {
			return
		}
		const order = sort.order === 'asc' ? 'desc' : 'asc'
		if (typeof onSort === 'function') {
			onSort(path, order)
		}
	}

	const renderSortIcon = (column: GTableColumn<T>) => {
		if (column.path !== sort.path) return <RiCodeLine className='h-3 w-3 rotate-90' />
		if (sort.order === 'asc') return <RiArrowUpSLine className="h-3 w-3" />
		return <RiArrowDownSLine className="h-3 w-3" />
	}

	return (
		<thead className="">
			<tr>
				{columns.map((column: GTableColumn<T>, index: number) => (
					<th
						className={classNames(
							'px-4 py-4  text-left text-sm font-semibold text-gray-900',
							column.expand ? 'w-full' : 'whitespace-nowrap',
							column.mobileHide ? 'hidden md:table-cell' : '',
							column.tabletHide ? 'hidden lg:table-cell' : ''
						)}
						key={column.label}

					>
						<div className={classNames('flex w-full h-full px-2 items-center', column.className || '')} >
							{column.header ? column.header() : column.label}
							{column.sortable &&
								<span className='mx-2 cursor-pointer' onClick={() => raiseSort(column)}>
									{renderSortIcon(column)}
								</span>
							}
						</div>
					</th>
				))}
			</tr>
		</thead >
	)
}

export default TableHeader
