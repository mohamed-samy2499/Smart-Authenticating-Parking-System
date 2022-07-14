import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { AppBar, Button } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useStores } from '../../hooks/useStores'
import { Link } from 'react-router-dom'
// Constants
import { sidebarItems, drawerWidth } from './constants'

export const AdminNavigator = () => {
	const { authStore } = useStores()
	const { logout } = authStore
	return (
		<div>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							width: '100%'
						}}
					>
						<Typography variant="h6" noWrap component="div">
              Admin
							{/* {user.has_store} */}
						</Typography>
						<Button
							type="submit"
							variant="contained"
							size="medium"
							color="error"
							onClick={() => logout()}
						>
              Logout
						</Button>
					</div>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					// flexShrink: 0,
					['& .MuiDrawer-paper']: {
						width: drawerWidth,
						boxSizing: 'border-box'
					}
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: 'auto' }}>
					<List>
						{sidebarItems.map((item, index) => (
							<Link
								key={item.title}
								// onClick={item.name === "logout" ? logout : ""}
								to={item.name !== 'logout ' ? item.link : '#'}
							>
								<ListItem button key={item.title}>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.title} />
								</ListItem>
							</Link>
						))}
					</List>
				</Box>
			</Drawer>
		</div>
	)
}
