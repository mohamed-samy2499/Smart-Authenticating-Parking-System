export interface MenuLinkProps {
	label: string
	to: () => string
	icon?: any
	className?: string
	allowedUsers?: string[],
	click?: () => void
}