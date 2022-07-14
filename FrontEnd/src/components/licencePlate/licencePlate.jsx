import React, { useEffect } from 'react'
import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	Grid,
	Box,
	Typography,
	Container,
	Fab
} from '@mui/material'
import './licencePlate.css'

export const LicencePlate = () => {
	const handleChange = event => {
		const data = new FormData(event.currentTarget)
		const formData = {
			text1: data.get('text-1'),
			text2: data.get('text-2'),
			text3: data.get('text-3'),
			number1: data.get('number-1'),
			number2: data.get('number-2'),
			number3: data.get('number-3')
		}
	}

	return (
		<Grid
			container
			direction="row"
			justifyContent="space-between"
			alignItems="center"
		>
			<Grid>LicencePlate</Grid>
			<Grid>
				<Box
					component="form"
					onChange={handleChange}
					className="licence-container"
				>
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
								defaultValue=""
							/>
						</div>
						<div className="licence-text">
							<TextField
								className="text-field-item"
								id="text-1"
								name="text-2"
								required
								inputProps={{ maxLength: 1 }}
								type="text"
								defaultValue=""
							/>
						</div>
						<div className="licence-text">
							<TextField
								className="text-field-item"
								id="text-1"
								name="text-3"
								required
								inputProps={{ maxLength: 1 }}
								type="text"
								defaultValue=""
							/>
						</div>
						<div className="licence-text">
							<TextField
								className="text-field-item"
								id="text-1"
								name="number-1"
								required
								inputProps={{ maxLength: 1 }}
								type="number"
								defaultValue=""
							/>
						</div>
						<div className="licence-text">
							<TextField
								className="text-field-item"
								id="text-1"
								name="number-2"
								required
								inputProps={{ maxLength: 1 }}
								type="number"
								defaultValue=""
							/>
						</div>
						<div className="licence-text">
							<TextField
								className="text-field-item"
								id="text-1"
								name="number-3"
								required
								inputProps={{ maxLength: 1 }}
								type="number"
								defaultValue=""
							/>
						</div>
					</Grid>
				</Box>
			</Grid>
		</Grid>
	)
}

{
	/* <Grid>
  <input
  id="T:trqwForNyabaopOnlyAbdd:LP1::content"
    name="T:trqwForNyabaopOnlyAbdd:LP1"
    aria-required="true"
    class="af_inputText_content"
    maxlength="1"
    type="text"
    value=""
  />
</Grid>
<Grid>
  <TextField
    autoComplete="plateId"
    name="ar"
    //   defaultValue={itemData ? itemData.plateId : ""}
    required
    id="plateId"
    label="Plate ID"
    autoFocus
  />
</Grid> */
}
{
	/* <TextField
autoComplete="plateId"
name="plateId"
//   defaultValue={itemData ? itemData.plateId : ""}
required
id="plateId"
label="Plate ID"
autoFocus
/> */
}
