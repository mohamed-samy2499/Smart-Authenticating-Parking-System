export interface GNoticeProps {
	title?: string
	content: any
	color?: 'neutral' | 'primary' | 'success' | 'danger' | 'warning'
	icon?: any
	link?: {
		label: string
		to: string,
	},
	actions?: any[]
}