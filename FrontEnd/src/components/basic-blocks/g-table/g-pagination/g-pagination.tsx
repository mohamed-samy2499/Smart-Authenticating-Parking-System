import PropTypes from 'prop-types'
import _ from 'lodash'
import { GButton } from '../../g-button'

export const GPagination = (props: any) => {
	const { itemsCount, pageSize, currentPage, onPageChange } = props
	const pagesCount = Math.ceil(itemsCount / pageSize)
	const firstItem = ((currentPage - 1) * pageSize) + 1
	const lastItem = (firstItem + pageSize - 1) >= itemsCount ? itemsCount : (firstItem + pageSize - 1)

	if (pagesCount === 1) return null

	return (
		<nav
			className="pt-8 -mb-1 flex items-center justify-between"
			aria-label="Pagination"
		>
			<div className="hidden sm:block">
				<p className="text-xs text-gray-700">
					Showing <span className="font-medium">({firstItem}</span> to <span className="font-medium">{lastItem})</span> of
					<span className="font-medium"> {itemsCount} </span> results
				</p>
			</div>
			<div className="flex-1 flex justify-between sm:justify-end">
				<GButton
					onClick={() => { onPageChange(currentPage - 1) }}
					size='xs'
					disabled={currentPage === 1}
					className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
				>
					Previous
				</GButton>
				<GButton
					onClick={() => { onPageChange(currentPage + 1) }}
					size='xs'
					disabled={currentPage === pagesCount}
					className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
				>
					Next
				</GButton>
			</div>
		</nav>
	)


}
GPagination.propTypes = {
	itemsCount: PropTypes.number.isRequired,
	pageSize: PropTypes.number.isRequired,
	currentPage: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired
}

