import { history } from '../../../helpers'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button
} from '@mui/material'
import EmptyView from '../../../components/EmptyView'
import { observer } from 'mobx-react'


export const UsersTable = observer( (props:any) => {
	const { customersArray } = props
	if (customersArray.length === 0) {
		return (
			<>
				<Button
					variant="outlined"
					style={{ marginBottom: '16px' }}
					onClick={() => history.push('/admin/system-users/new')}
				>
          Add System User
				</Button>
				<EmptyView />
			</>
		)
	}

	const displayedProducts = customersArray

	return (
		<>
			<Button
				variant="outlined"
				style={{ marginBottom: '16px' }}
				onClick={() => history.push('/admin/system-users/new')}
			>
        Add System User
			</Button>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="left">Email</TableCell>
							<TableCell align="left">Role</TableCell>
							{/* <TableCell align="left">Action</TableCell> */}
						</TableRow>
					</TableHead>
					<TableBody>
						{displayedProducts.map((row:any) => (
							<TableRow
								key={row.name}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									{row.name}
								</TableCell>
								<TableCell align="left">{row.email || ''}</TableCell>
								<TableCell align="left">{row.systemUserRole || ''}</TableCell>
								{/* <TableCell align="left">
                  <Button
                    variant="contained"
                    color="warning"
                    // onClick={() => deleteProduct(row.id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Logs
                  </Button>
                  <Link
                    to={{
                      pathname: "/admin/customers/new"
                      // data: row
                    }}
                    style={{ marginLeft: "8px" }}
                  >
                    <Button variant="contained">Edit</Button>
                  </Link>
                </TableCell> */}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	)
})
