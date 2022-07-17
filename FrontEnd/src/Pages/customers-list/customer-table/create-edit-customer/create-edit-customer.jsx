import  { useState } from 'react'
import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	Grid,
	Box,
	Typography,
	Container,

} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import { observer } from 'mobx-react'
import { useStores } from '../../../../hooks/useStores'


import './create-edit-customer.css'
import { GLoading } from 'components/basic-blocks'

export const CreateEditCustomer = observer((props) => {
	const {row,onClose} = props
	const data = row

	const { customersStore,uiStore } = useStores()
	const { createCustomer, updateCustomer } = customersStore
	const [errors, setErrors] = useState({ nid: '' })
	console.log('data',data)
	const [formState, setFormState] = useState({
		text1:data?.vehicles[0]?.plateNumberId[0]|| '',
		text2: data?.vehicles[0]?.plateNumberId[1]||'',
		text3: data?.vehicles[0]?.plateNumberId[2]||'',
		number1: data?.vehicles[0]?.plateNumberId[3]||'',
		number2: data?.vehicles[0]?.plateNumberId[4]||'',
		number3:data?.vehicles[0]?.plateNumberId[5]|| '',
		name: data?.name || '',
		nid: data?.nationalId || '',
		isEgyptian:data?.isEgyptian|| true,
		email:data?.email || ''
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
			name: formState.name,
			NationalId: formState.nid,
			isEgyptian: formState.isEgyptian,
			email: formState.email,
			PlateNumberIds: [licence]
		}

		data
			? console.log('Update not working for now', formData)
			: validate() && createCustomer(formData)

		data ? updateCustomer(formData, data.id,onClose) : createCustomer(formData,onClose)
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
					{data ? 'Edit' : 'New'} Customer
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
						{/* <Grid item xs={12} sm={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formState.isEgyptian}
                    onChange={e => handleChange(e.target.checked, "isEgyptian")}
                  />
                }
                label="Egyptian"
              />
            </Grid> */}
						{formState.isEgyptian && (
							<Grid item xs={12} sm={12}>
								<TextField
									autoComplete="NID"
									type="number"
									name="NID"
									value={formState.nid}
									inputProps={{
										onKeyPress: e => limitKeypress(e, formState.nid, 14)
									}}
									required
									fullWidth
									id="NID"
									label="National ID"
									autoFocus
									onChange={e => handleChange(e.target.value, 'nid')}
									{...(errors.nid && {
										error: true,
										helperText: errors.nid
									})}
								/>
							</Grid>
						)}
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

						{/* <Grid item xs={12} sm={12}>
							<label htmlFor="upload-photo">
								<input
									style={{ display: 'none' }}
									id="upload-photo"
									name="upload-photo"
									type="file"
									disabled
								/>

								<Button
									disabled
									color="primary"
									variant="contained"
									component="span"
								>
                  Upload your face Photo
								</Button>
							</label>
						</Grid> */}
						{/* <Grid item xs={12} sm={12}>
              <TextField
                // onChange={e => console.log("hello")}
                autoComplete="endDate"
                name="startDate"
                defaultValue={
                  itemData ? itemData.startDate.toISOString().split("T")[0] : ""
                }
                required
                fullWidth
                id="startDate"
                label="Start Date"
                autoFocus
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                // onChange={e => console.log("hello")}
                autoComplete="endDate"
                name="endDate"
                defaultValue={
                  itemData ? itemData.endDate.toISOString().split("T")[0] : ""
                }
                required
                fullWidth
                id="endDate"
                label="End Date"
                autoFocus
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid> */}
					</Grid>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						{uiStore.apiCallStates.mutateCustomers==='loading'?<GLoading />: 'SAVE'}
					</Button>
				</Box>
			</Box>
		</Container>
	)

	function handleChange(value, name) {
		setFormState({ ...formState, [name]: value })
	}

	// function handleSubmit(event: any) {
	//   event.preventDefault();
	//   const formData = {
	//     Email: formState.email,
	//     password: formState.password
	//   };
	//   validate() && login(formData);
	// }

	function validate() {
		let temp = { nid: '' }

		temp.nid =
      formState.nid.trim().length === 14? '': 'National ID must be 14 numbers'

		console.log(temp.nid)
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
