import { GButton, GInput} from 'components/basic-blocks'
import { ModalTypes } from 'components/basic-blocks/g-modal/types'

import { ChangeEvent, useState } from 'react'
import { observer } from 'mobx-react'
import { addSystemUserScheme } from './validations'
import { useStores } from 'hooks/useStores'


export const AddSystemUser = observer(() => {
	const { uiStore} = useStores()
	const { setModalContent } = uiStore
	
	function renderModal() {
		setModalContent({
			title: 'Add System User',
			type: ModalTypes.INFO,
			actionsEnabled: false,
			showIcon: false,
			body: <ModalBody />
		})
	}

	return (
		<GButton color='primary' size='sm' label="Add Member" onClick={() => renderModal()} />
	)
})
	
	
	
const ModalBody = observer(() => {
	const { uiStore,systemUsersStore } = useStores()
	const { createSystemUser } = systemUsersStore
	const { setModalState } = uiStore
	const [addSystemUserForm, setAddSystemUserForm] = useState<Record<string, string>>({name:'', email: '', password: '' })
	const [formErrors, setFormErrors] = useState<null | Partial<{name:string, email: string, password: string }>>()

	return (
		<>
			<form>
				<div className='my-4 w-full'>
					<GInput 
						label='Name'
						name='name' 
						placeholder='john doe'
						type="text"
						value={addSystemUserForm.name}
						onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
						error={formErrors?.name}
					/>
				</div>
				<div className='my-4 w-full'>
					<GInput 
						label='Email'
						name='email' 
						placeholder='john.doe@company.com'
						type="email"
						value={addSystemUserForm.email}
						onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
						error={formErrors?.email}
					/>
				</div>
				<div className='my-4 w-full'>
					<GInput 
						label='Password'
						name='password' 
						placeholder='Password...'
						type="password"
						value={addSystemUserForm.password}
						onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
						error={formErrors?.password}
					/>
				</div>
			</form>
			<div className="flex justify-end gap-4 mt-5 ">
				<GButton
					label='Cancel'
					onClick={() => setModalState(false)}
				/>
				<GButton
					variant='contained'
					label='Create'
					color='primary'
					onClick={() => confirmSendInvite()}
					loading={uiStore.apiCallStates.mutateSystemUser==='loading'}
				/>
			</div>

		</>

	)
	function handleChange({ currentTarget: input }: any) {
		console.log('input',input.name)
		const form = { ...addSystemUserForm }
		form[input.name] = input.value
		setAddSystemUserForm(form)
	}

	function validate() {
		const options = { abortEarly: false }
		const { error } = addSystemUserScheme.validate({ 	name: addSystemUserForm.name, email: addSystemUserForm.email, password: addSystemUserForm.password }, options)
		if (!error) return null
		const errors: Record<string, string> = {}
		console.log('errors', error.details)

		error.details.forEach((item) => {
			errors[item.path[0]] = item.message
		})
		return errors
	}


	async function confirmSendInvite() {
		const payload = {
			Name: addSystemUserForm.name,
			Email: addSystemUserForm.email,
			Password: addSystemUserForm.password,
			Role: 'admin'
		}
		const errors = validate()

		setFormErrors(errors)

		if (errors) return
		console.log('payload', payload)
		try{
			await createSystemUser(payload)
			setModalState(false)
		}catch(e){
			console.log(e)
		}
	}
})