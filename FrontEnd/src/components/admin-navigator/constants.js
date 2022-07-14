import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PersonIcon from '@mui/icons-material/Person'
import GroupIcon from '@mui/icons-material/Group'
import SettingsIcon from '@mui/icons-material/Settings'

export const drawerWidth = 240

export const sidebarItems = [
	{
		title: 'Profile',
		icon: <AccountCircleIcon />,
		name: 'Profile',
		link: '/admin/profile'
	},
	{
		title: 'System Users',
		icon: <GroupIcon />,
		name: 'System Users',
		link: '/admin/system-users'
	},
	{
		title: 'Customers',
		icon: <PersonIcon />,
		name: 'Customers',
		link: '/admin/customers'
	},
	{
		title: 'Cars',
		icon: <GroupIcon />,
		name: 'Cars',
		link: '/admin/cars'
	},
	{
		title: 'Control',
		icon: <SettingsIcon />,
		name: 'Control',
		link: '/admin/control'
	}
	// { title: "LogOut", icon: <LogoutIcon />, name: "logout", link: "" }
]
