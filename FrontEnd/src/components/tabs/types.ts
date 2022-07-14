export interface TabsProps {
	current: string
	tabs: Array<TabItem>
	actions?: any
}

export interface TabItem {
	key: string
	label: string
	to: () => string
	notification?: {
		color: 'primary' | 'success' | 'warning' | 'danger'
		count?: number
	}
}