import {useState} from 'react'
import { GStepsPropsType } from './types'

const classNames = (...classes:any) => {
	return classes.filter(Boolean).join(' ')
}

export const GSteps = ({value, options, activeColor, handleClick}: GStepsPropsType) => {
	const [activeStep, setActiveStep] = useState(value)
	const activeBgColorClasses: any = {
		primary: 'rgba(38 132 214)',
		success: 'rgba(118 195 73)',
		warning: 'rgba(244 128 36)',
		danger: 'rgba(213 28 42)',
		defaultGray: 'rgb(229, 231, 235)',
		lightGray: 'rgb(243, 244, 246)'
	}
	const activeBgColor = activeBgColorClasses['success']
	return (
		<div className="g-steps mb-4">
			<nav aria-label="Progress">
				<ol role="list" className="flex items-center flex-100 mt-4 justify-center">
					{options.map((step, stepIdx) => (
						<li key={step.name} className={classNames(stepIdx !== options.length - 1 ? 'pr-12' : '', 'relative')} 
							style={ stepIdx !== options.length - 1 ? { paddingRight: '22%'} : {}}
							onClick={() => {
								handleClick(step.id)
								setActiveStep(step.id)
							}}
						>
							{step.id !== activeStep ? (
								<>
									<div className="absolute inset-0 flex items-center" aria-hidden="true" 
										style={ 
											stepIdx === 0 ? {left: '2px'} : {}
										}
									>
										<div className="h-0.5 w-full" style={{backgroundColor: activeBgColorClasses['defaultGray']}}  />
									</div>
									<a
										href="#"
										className="relative w-5 h-5 flex items-center justify-center border-2 rounded-full"
										aria-current="step"
										style={{backgroundColor: activeBgColorClasses['defaultGray']}}
									>
										<span className="sr-only">{step.name}</span>
										<span 
											className="relative pt-14 text-sm whitespace-nowrap"
											style={ 
												stepIdx === options.length - 1 ? { paddingRight: '60px'} : stepIdx === 0 ? {paddingLeft: '73px'} : {}
											}
										>{step.name}</span>

									</a>
								</>
							) : (
								<>
									<div className="absolute inset-0 flex items-center" aria-hidden="true">
										<div className="h-0.5 w-full bg-gray-200" />
									</div>
									<a
										href="#"
										className="relative w-5 h-5 flex items-center justify-center border-4 rounded-full"
										style={{ borderColor: activeBgColor, backgroundColor: activeBgColorClasses['lightGray'] }}
										aria-current="step"
									>
										<span className="sr-only">{step.name}</span>
										<span 
											className="relative pt-14 text-sm whitespace-nowrap"
											style={ 
												stepIdx === options.length - 1 ? { paddingRight: '60px'} : stepIdx === 0 ? {paddingLeft: '65px'} : {}
											}
										>{step.name}</span>
									</a>

								</>
							)}
						</li>
					))}
				</ol>
			</nav>
		</div>
	)
}