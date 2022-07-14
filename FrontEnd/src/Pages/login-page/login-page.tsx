import { useState } from 'react'

import { useStores } from '../../hooks/useStores'
import { observer } from 'mobx-react'
import { loginFormSchema } from './validations'
import { GInput,GButton } from 'components/basic-blocks'
import { NavLink } from 'react-router-dom'
import { FaParking } from 'react-icons/fa'

export const LoginPage = observer(()=> {

	type loginForm = {
		email: string,
		password: string,
	}
	
	const { authStore,uiStore } = useStores()
	const { login } = authStore
	const [loginFormState, setLoginFormState] = useState({
		email: '',
		password: ''
	})
	const [errors, setErrors] = useState<null | Partial<loginForm>>()
	return (
		<>
			<div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<NavLink to='/'>
						<div className='flex gap-2 items-center justify-center'>
							<FaParking className='w-24 h-24 text-primary-500' />
						</div>
					</NavLink>
				</div>
				
				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
						<h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
						<form className="space-y-4">
							<div>
								<GInput
									label='Email Address'
									id="email"
									name="email"
									type="text"
									onChange={(e)=>handleChange(e,'email')}
									error={errors?.email}
								/>
						
							</div>
							<div>
								<GInput
									label='Password'
									id="password"
									name="password"
									type="password"
									onChange={(e)=>handleChange(e,'password')}
									error={errors?.password}
								/>
								{/* {uiStore.apiCallStates.login ==='error' && (
									<h4 className='text-danger-500 mt-2'>
										Wrong email or password
									</h4>
								)} */}
							</div>
							<div className="text-sm flex justify-end items-center">
								<a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
								</a>
							</div>
							<GButton
								onClick={()=>handleSubmit()}
								variant="contained"
								color='primary'
								className='w-full'
								loading={uiStore.apiCallStates.login === 'loading'}
							>
								Sign In
							</GButton>
						</form>
					</div>
				</div>
			</div>
		</>
	)
	function handleChange(e: any, name: 'email' | 'password') {
		const input = e.currentTarget
		const form = { ...loginFormState }

		if (!input) {
			form[name] = e
			setLoginFormState(form)
			return
		}

		form[name] = input.value
		setLoginFormState(form)
	}

	function handleSubmit() {
		const payload = {
			email: loginFormState.email,
			password: loginFormState.password,
		}
		console.log(payload)

		const errors = validate()
		setErrors(errors)

		if (errors) return
		login(payload)

	}

	function validate() {
		const options = { abortEarly: false }
		const { error } = loginFormSchema.validate({
			email: loginFormState.email,
			password: loginFormState.password,
		}, options)

		if (!error) return null

		const errors: Record<string, string> = {}

		error.details.forEach((item) => {
			errors[item.path[0]] = item.message
		})
		return errors
	}
})