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
import { useStores } from '../../../hooks/useStores'
import { useLocation } from 'react-router-dom'

import './create-edit-car.css'
export const CreateEditCar = observer( (props) => {
	const {data} = props

	// let location = useLocation()
	// const itemData = location.data
	console.log('cars data',data)

	const { carsStore } = useStores()
	const { createCar } = carsStore
	const [errors, setErrors] = useState({ nid: '' })

	const [formState, setFormState] = useState({
		text1: data?.plateNumberId[0]|| '',
		text2:data?.plateNumberId[1]|| '',
		text3:data?.plateNumberId[2]|| '',
		number1:data?.plateNumberId[3]|| '',
		number2:data?.plateNumberId[4]|| '',
		number3:data?.plateNumberId[5]|| '',
		brand:data?.brandName ||'',
		model:data?.subCategory ||'',
		color:data?.color ||'',
		startDate: data?.startSubscription? new Date(data?.startSubscription) :'',
		endDate: data?.endSubscription? new Date(data?.endSubscription) :''
	})

  

	const handleSubmit = event => {
		event.preventDefault()
		const licence =
      formState.text1 +
      formState.text2 +
      formState.text3 +
      formState.number1 +
      formState.number2 +
      formState.number3
		const formData = {
			PlateNumberId: licence,
			BrandName: formState.brand,
			SubCategory: formState.model,
			Color: formState.color,
			StartSubscription: formState.startDate,
			EndSubscription: formState.endDate
		}

		data
			? console.log('Update not working for now', formData)
			: validate() && createCar(formData)
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
					{data ? 'Edit' : 'New'} Car
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<FormControl fullWidth>
								<InputLabel id="car-brand-label">Car Brand</InputLabel>
								<Select
									labelId="car-brand-label"
									id="car-brand-label"
									value={formState.brand}
									label="Age"
									onChange={e => handleChange(e.target.value, 'brand')}
									required
								>
									{carBrands.map(brand => (
										<MenuItem value={brand} key={brand}>
											{brand}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={12}>
							<FormControl fullWidth>
								<InputLabel id="car-model-label">Car Model</InputLabel>
								<Select
									labelId="car-model-label"
									id="car-model-label"
									value={formState.model}
									label="Age"
									onChange={e => handleChange(e.target.value, 'model')}
									disabled={!formState.brand}
									required
								>
									{formState.brand &&
                    carModels[formState.brand].map(model => (<MenuItem value={model} key={model}>{model}</MenuItem>))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								autoComplete="color"
								name="color"
								value={formState.color}
								required
								fullWidth
								id="color"
								label="Color"
								autoFocus
								onChange={e => handleChange(e.target.value, 'color')}
							/>
						</Grid>

						<Grid item xs={12} sm={12}>
							<Grid
								container
								direction="row"
								justifyContent="center"
								alignItems="center"
							>
								<Grid
									container
									direction="row"
									justifyContent="space-between"
									alignItems="center"
								>
									<Grid>LicencePlate</Grid>
									<Grid>
										<Grid
											container
											direction="row"
											justifyContent="center"
											alignItems="center"
										>
											<div className="licence-text">
												<TextField
													className="text-field-item"
													id="text-1"
													name="text-1"
													required
													type="text"
													inputProps={{ maxLength: 1 }}
													value={formState.text1}
													onChange={e => handleChange(e.target.value, 'text1')}
												/>
											</div>
											<div className="licence-text">
												<TextField
													className="text-field-item"
													id="text-2"
													name="text-2"
													required
													inputProps={{ maxLength: 1 }}
													type="text"
													value={formState.text2}
													onChange={e => handleChange(e.target.value, 'text2')}
												/>
											</div>
											<div className="licence-text">
												<TextField
													className="text-field-item"
													id="text-3"
													name="text-3"
													required
													inputProps={{ maxLength: 1 }}
													type="text"
													value={formState.text3}
													onChange={e => handleChange(e.target.value, 'text3')}
												/>
											</div>
											<div className="licence-text">
												<TextField
													className="text-field-item"
													id="number-1"
													name="number-1"
													required
													type="text"
													inputProps={{
														pattern: '[0-9]+',
														maxLength: '1'
													}}
													value={formState.number1}
													onChange={e =>
														handleChange(e.target.value, 'number1')
													}
												/>
											</div>
											<div className="licence-text">
												<TextField
													className="text-field-item"
													id="number-2"
													name="number-2"
													required
													inputProps={{
														pattern: '[0-9]+',
														maxLength: '1'
													}}
													type="text"
													value={formState.number2}
													onChange={e =>
														handleChange(e.target.value, 'number2')
													}
												/>
											</div>
											<div className="licence-text">
												<TextField
													className="text-field-item"
													id="number-3"
													name="number-3"
													required
													type="text"
													inputProps={{
														pattern: '[0-9]+',
														maxLength: '1'
													}}
													value={formState.number3}
													onChange={e =>
														handleChange(e.target.value, 'number3')
													}
												/>
											</div>
										</Grid>
										{/* </Box> */}
									</Grid>
								</Grid>
							</Grid>
						</Grid>

						<Grid item xs={12} sm={12}>
							<TextField
								autoComplete="startDate"
								name="startDate"
								value={formState.startDate}
								required
								fullWidth
								id="startDate"
								label="Start Date"
								autoFocus
								type="date"
								InputLabelProps={{
									shrink: true
								}}
								onChange={e => handleChange(e.target.value, 'startDate')}
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								autoComplete="endDate"
								name="endDate"
								value={formState.endDate}
								required
								fullWidth
								id="endDate"
								label="End Date"
								autoFocus
								type="date"
								InputLabelProps={{
									shrink: true
								}}
								onChange={e => handleChange(e.target.value, 'endDate')}
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
		if (name === 'brand') {
			setFormState({ ...formState, [name]: value, model: '' })
		} else {
			setFormState({ ...formState, [name]: value })
		}
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
