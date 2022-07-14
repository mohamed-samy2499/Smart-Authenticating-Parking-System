export interface GTableProps<T> {
	columns: Array<GTableColumn<T>>
	data: Array<T>
	showHeader?: boolean
	pageSize?: number
	rowClassName?: (item: T) => string
}

export interface GTableState {
	page: number
	sortPath: string | null
	sortOrder: 'asc' | 'desc'
}

export interface GTableHeaderProps<T> {
	columns: Array<GTableColumn<T>>
	sort: {
		path: string | null
		order: 'asc' | 'desc'
	}
	onSort: (path: string, order: 'asc' | 'desc') => void
}

export interface GTableBodyProps<T> {
	columns: Array<GTableColumn<T>>
	data: Array<T>
	showDivider?: boolean
	rowClassName?: (item: T) => string
}

export interface GTableColumn<T> {
	label: string
	path?: string
	sortable?: boolean
	expand?: boolean
	mobileHide?: boolean
	tabletHide?: boolean
	className?: string
	header?: () => JSX.Element | Element | string
	render?: (item: T) => JSX.Element | Element | string
}