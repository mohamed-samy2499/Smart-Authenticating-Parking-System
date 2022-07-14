import { ReactComponent } from '*.svg'
import { Dispatch, ReactNode, SetStateAction, } from 'react'

export enum ModalTypes {
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warning',
	DANGER = 'danger'
}

export interface GmodalProps {
	open?: boolean,
	setOpen?: Dispatch<SetStateAction<boolean>>,
	showIcon?: boolean
	title?: string,
	description?: string,
	type?: ModalTypes,
	icon?: typeof ReactComponent,
	confirm?: () => void,
	confirmLabel?: string,
	cancel?: () => void,
	customActions?: any
	body?: ReactNode,
	confirmDisabled?: boolean
	actionsEnabled?: boolean
}