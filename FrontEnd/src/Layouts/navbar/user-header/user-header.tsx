
import { UserHeaderDropdown } from './user-header-dropdown'
import { UserHeaderMobile } from './user-header-mobile'

export function UserHeader() {
	return (
		<div>
			<div className='hidden md:block'>
				<UserHeaderDropdown />
			</div>
			<div className='md:hidden'>
				<UserHeaderMobile />
			</div>
		</div>
	)
}

