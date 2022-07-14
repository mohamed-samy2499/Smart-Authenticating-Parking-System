// itemData ? itemData.endDate.toISOString().split("T")[0] : "";
import { useState } from 'react'
import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	Grid,
	Box,
	Typography,
	Container,
	FormControl,
	InputLabel,
	Select,
	MenuItem
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import { carBrands, carModels } from './constants'

import { observer } from 'mobx-react'
import { useStores } from '../../hooks/useStores'
import { useLocation } from 'react-router-dom'

export const CreateEditSystemUser = observer(() => {
	const { systemUsersStore } = useStores()
	const { createSystemUser } = systemUsersStore
	const [errors, setErrors] = useState({ nid: '' })

	const [formState, setFormState] = useState({
		name: '',
		email: '',
		password: '',
		role: ''
	})

	let location = useLocation()
	const itemData = location.data

	const handleSubmit = event => {
		event.preventDefault()

		const formData = {
			Name: formState.name,
			Email: formState.email,
			Password: formState.password,
			Role: 'admin'
		}

		itemData
			? console.log('Update not working for now', formData)
			: validate() && createSystemUser(formData)
		// : console.log("data to be submitted", formData);

		// itemData ? updateProduct(formData, itemData.id) : createProduct(formData);
	}
	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<AddCircleIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					{itemData ? 'Edit' : 'New'} System User
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<TextField
								autoComplete="name"
								name="name"
								value={formState.name}
								required
								fullWidth
								id="name"
								label="Name"
								autoFocus
								onChange={e => handleChange(e.target.value, 'name')}
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								autoComplete="email"
								type="email"
								name="email"
								value={formState.email}
								required
								fullWidth
								id="email"
								label="Email"
								autoFocus
								onChange={e => handleChange(e.target.value, 'email')}
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								autoComplete="password"
								type="password"
								name="password"
								value={formState.password}
								required
								fullWidth
								id="password"
								label="Password"
								autoFocus
								onChange={e => handleChange(e.target.value, 'password')}
							/>
						</Grid>
					</Grid>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
            SAVE
					</Button>
				</Box>
			</Box>
		</Container>
	)

	function handleChange(value, name) {
		setFormState({ ...formState, [name]: value })
		console.log('current state on change', formState)
	}
	function validate() {
		let temp = { nid: '' }

		setErrors({
			...temp
		})
		return Object.values(temp).every(x => x == '')
	}
})
function limitKeypress(event, value, maxLength) {
	if (value != undefined && value.toString().length >= maxLength) {
		event.preventDefault()
	}
}
