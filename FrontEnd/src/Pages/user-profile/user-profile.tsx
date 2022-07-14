import { observer } from 'mobx-react'
import { useStores } from '../../hooks/useStores'
import { GSection } from 'components/basic-blocks'
import {PageHeader} from '../../components/page-header'
import { UserAvatar } from 'components/user-avatar'

export const UserProfile = observer(() => {
	const { authStore } = useStores()
	const { user } = authStore

	return (
		<div className="" >
			<PageHeader title="Profile" subtitle='Manage your personal profile information and preferences' />
			<div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
				<div className='mx-auto'>
					<GSection
						subtitle='Your basic profile information'
					>
						<dl className="sm:divide-y sm:divide-gray-200 -mx-4 sm:-mx-5 lg:-mx-6">
							<div className="py-4 sm:py-5 px-4 sm:px-5 lg:px-6 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
								<dt className="text-sm font-medium text-gray-500">Full name</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									{user?.name || 'None'}
								</dd>
							</div>
							<div className="py-4 sm:py-5 px-4 sm:px-5 lg:px-6 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
								<dt className="text-sm font-medium text-gray-500">Profile picture</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
									<UserAvatar user={user} src={undefined} size={10} />			
								</dd>
							</div>
							<div className="py-4 sm:py-5 px-4 sm:px-5 lg:px-6 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
								<dt className="text-sm font-medium text-gray-500">Email</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									{ user?.email || 'N/A'}
								</dd>
							</div>
							<div className="py-4 sm:py-5 px-4 sm:px-5 lg:px-6 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
								<dt className="text-sm font-medium text-gray-500">Role</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									{ user?.systemUserRole || 'N/A'}
								</dd>
							</div>
						</dl>
					</GSection>
					
				</div>
			</div>
		</div >
	)
})
