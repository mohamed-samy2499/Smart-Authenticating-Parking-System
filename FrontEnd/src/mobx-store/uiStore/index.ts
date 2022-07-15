import { GmodalProps } from 'components/basic-blocks/g-modal/types'
import { makeAutoObservable, runInAction } from 'mobx'
import { toast } from 'react-toastify'

export class UiStore {
	constructor() {
		makeAutoObservable(this)
	}

	modalStatus = false
	modalContent = {}

	setModalState = (value: boolean) => this.modalStatus = value
	setModalContent = (content: GmodalProps) => {
		this.setModalState(true)
		this.modalContent = { ...content }
	}




	activePath = '/'
	context = 'admin'
	notificationData = {}

	setActivePage = (path: string) => {
		this.activePath = path
		this.context = 'admin'
	}

	sidebarCollapsed = false

	collapseSidebar = (val: boolean) => {
		this.sidebarCollapsed = val
	}

	mobileSidebarOpen = false
	setMobileSidebarOpen = (value: boolean) => {
		this.mobileSidebarOpen = value
	}

	mobileUserMenuOpen = false
	setMobileUserMenuOpen = (value: boolean) => {
		this.mobileUserMenuOpen = value
	}

	showNotification = (message: string, status: string) => {
		this.notificationData = {
			message,
			status,
		}
	}

	hideNotification = () => {
		this.notificationData = {}
	}




	apiCallStates: Record<string, 'idle' | 'loading' | 'success' | 'error'> = {
		login: 'idle',

		getSystemUsers: 'idle',
		mutateSystemUsers: 'idle',

		getCars: 'idle',
		mutateCars: 'idle',

		getCustomers: 'idle',
		mutateCustomers: 'idle',

		uploadCustomerVideo: 'idle',
	}

	setCallState(key: string, state: 'idle' | 'loading' | 'success' | 'error', message?: string) {
		this.apiCallStates[key] = state

		if (state === 'success' || state === 'error') {
			if (message && state === 'success') {
				toast.success(message)
			}
			if (message && state === 'error') {
				toast.error(message)
			}

			setTimeout(() => {
				runInAction(() => {
					this.apiCallStates[key] = 'idle'
				})
			}, 3000)
		}
	}
}





