import React from 'react'
import { StoresContext } from '../storesContext'

export const StoresProvider = (props: any) => {
	const { stores, children } = props
	return (
		<StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
	)
}
