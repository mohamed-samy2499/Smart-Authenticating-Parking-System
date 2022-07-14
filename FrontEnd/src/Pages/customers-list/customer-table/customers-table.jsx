import { history } from '../../../helpers'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyView from '../../../components/EmptyView'
import moment from 'moment'

export const CustomerTable = observer(props => {
	const navigate =useNavigate()
	const { customersArray } = props
	if (customersArray.length === 0) {
		return (
			<>
				<Button
					variant="outlined"
					style={{ marginBottom: '16px' }}
					onClick={() =>navigate('/customers/new')}
				>
          Add Customer
				</Button>
				<EmptyView />
			</>
		)
	}

	const displayedProducts = customersArray
	console.log('customersArray',customersArray)
	return (
		<>
			<Button
				variant="outlined"
				style={{ marginBottom: '16px' }}
				onClick={() => navigate('/customers/new')}
			>
        Add Customer
			</Button>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="left">Email</TableCell>
							<TableCell align="left">Plate ID</TableCell>
							{/* <TableCell align="left">Face ID</TableCell> */}
							<TableCell align="left">Start Date</TableCell>
							<TableCell align="left">End Date</TableCell>
							<TableCell align="left">Status</TableCell>
							<TableCell align="left">Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{displayedProducts.map(row => (
							<TableRow
								key={row?.email}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									{row.name}
								</TableCell>
								<TableCell align="left">{row.email || ''}</TableCell>
								<TableCell align="left">{row.vehicles[0]?.plateNumberId || ''}</TableCell>
								{/* <TableCell align="left">{row.faceId || ""}</TableCell> */}
								<TableCell align="left">
									{moment(row?.vehicles[0]?.startSubscription).format('LL')||''}
								</TableCell>
								<TableCell align="left">
									{moment(row?.vehicles[0]?.endSubscription).format('LL')||''}
								</TableCell>
								<TableCell align="left">
									{row.status ? 'Activated' : 'Not-Active'}
								</TableCell>
								<TableCell align="left">
									<Button
										variant="contained"
										color="warning"
										// onClick={() => deleteProduct(row.id)}
										style={{ marginLeft: '8px' }}
									>
                    Logs
									</Button>
									<Link
										to={{
											pathname: '/admin/customers/edit',
											data: row
										}}
										style={{ marginLeft: '8px' }}
									>
										<Button variant="contained">Edit</Button>
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	)
})
