import { ReactComponent } from '*.svg'
import { Dispatch, ReactNode, SetStateAction, } from 'react'

export enum ModalTypes {
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warning',
	DANGER = 'danger'
}

export interface GDialogProps {
	open: boolean,
	onClose: () => void,
	title?: string,
	subtitle?: string,
	description?: string,
	icon?: any
	children?: ReactNode,
	showClose?: boolean
	className?: string
}