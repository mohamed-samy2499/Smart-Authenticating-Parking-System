import { GTableColumn } from 'components/basic-blocks/g-table/types'

export const columns: Array<GTableColumn<any>> = [
	{ label: 'Name', path: 'name', className: '-mr-6' },
	{ label: 'Email', path: 'email' },
	{ label: 'Role', path: 'systemUserRole' },
]