import { TabItem } from 'components/tabs/types'

export interface PageHeaderProps {
	title: string,
	mode?: 'simple' | 'full'
	subtitle?: string,
	currentTab?: string
	tabs?: Array<TabItem>,
	tabsActions?: any
	tags?: Array<{ icon?: any, label?: string | null }>,
	action?: any
}