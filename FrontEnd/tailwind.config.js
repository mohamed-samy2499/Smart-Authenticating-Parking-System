/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const defaultTheme = require('tailwindcss/defaultTheme')

function withOpacityValue(variable) {
	return ({ opacityValue }) => {
		if (opacityValue === undefined) {
			return `rgb(var(${variable}))`
		}
		return `rgb(var(${variable}) / ${opacityValue})`
	}
}

module.exports = {
	mode: 'jit',
	content: [
		'./public/**/*.html',
		'./src/**/*.{js,jsx,ts,tsx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter var', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				primary:{
					100:withOpacityValue('--color-primary-100'),
					200:withOpacityValue('--color-primary-200'),
					300:withOpacityValue('--color-primary-300'),
					400:withOpacityValue('--color-primary-400'),
					500:withOpacityValue('--color-primary-500'),
					600:withOpacityValue('--color-primary-600'),
					700:withOpacityValue('--color-primary-700'),
					800:withOpacityValue('--color-primary-800'),
					900:withOpacityValue('--color-primary-900'),
				},
				secondary:{
					100:withOpacityValue('--color-secondary-100'),
					200:withOpacityValue('--color-secondary-200'),
					300:withOpacityValue('--color-secondary-300'),
					400:withOpacityValue('--color-secondary-400'),
					500:withOpacityValue('--color-secondary-500'),
					600:withOpacityValue('--color-secondary-600'),
					700:withOpacityValue('--color-secondary-700'),
					800:withOpacityValue('--color-secondary-800'),
					900:withOpacityValue('--color-secondary-900'),
				},
				success:{
					100:withOpacityValue('--color-success-100'),
					200:withOpacityValue('--color-success-200'),
					300:withOpacityValue('--color-success-300'),
					400:withOpacityValue('--color-success-400'),
					500:withOpacityValue('--color-success-500'),
					600:withOpacityValue('--color-success-600'),
					700:withOpacityValue('--color-success-700'),
					800:withOpacityValue('--color-success-800'),
					900:withOpacityValue('--color-success-900'),
				},
				warning:{
					100:withOpacityValue('--color-warning-100'),
					200:withOpacityValue('--color-warning-200'),
					300:withOpacityValue('--color-warning-300'),
					400:withOpacityValue('--color-warning-400'),
					500:withOpacityValue('--color-warning-500'),
					600:withOpacityValue('--color-warning-600'),
					700:withOpacityValue('--color-warning-700'),
					800:withOpacityValue('--color-warning-800'),
					900:withOpacityValue('--color-warning-900'),
				},
				danger:{
					100:withOpacityValue('--color-danger-100'),
					200:withOpacityValue('--color-danger-200'),
					300:withOpacityValue('--color-danger-300'),
					400:withOpacityValue('--color-danger-400'),
					500:withOpacityValue('--color-danger-500'),
					600:withOpacityValue('--color-danger-600'),
					700:withOpacityValue('--color-danger-700'),
					800:withOpacityValue('--color-danger-800'),
					900:withOpacityValue('--color-danger-900'),
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
}
