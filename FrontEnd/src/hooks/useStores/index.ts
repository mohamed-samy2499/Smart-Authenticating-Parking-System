import { useContext } from 'react'
import { StoresContext } from '../../mobx-store/storesContext'

export const useStores = () => {
	const stores = useContext(StoresContext)

	return stores
}
