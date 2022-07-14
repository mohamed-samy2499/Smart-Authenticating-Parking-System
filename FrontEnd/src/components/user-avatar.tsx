interface HeaderProps {
  user?:any;
  size?: number;
  src?: string;
}

export const UserAvatar = ({ user, size, src }: HeaderProps) => (
	<img
		className={`inline-block h-${size || 10} w-${
			size || 10
		} rounded-full border-2 border-gray-300`}
		src={
			src || user?.avatar || `https://eu.ui-avatars.com/api/?name=${user?.name}`
		}
		alt="user photo"
	/>

	// <div className="flex-shrink-0">
	// 	<img className={`h-${size || 10} w-${size || 10} rounded-full object-cover`} src={src || user?.avatar || `https://eu.ui-avatars.com/api/?name=${user?.name}`} alt='user photo' />
	// </div>
)
