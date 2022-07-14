import { useState } from 'react'
import { Button, Typography } from '@mui/material'
import { ApiCallStates } from '../../mobx-store/types'
import http from '../../Services/httpService'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { observer } from 'mobx-react'
import { GButton, GSection } from 'components/basic-blocks'
import { PageHeader } from 'components/page-header'

export const Control =  observer((props: any) =>{
	const [connection, setConnection] = useState<HubConnection|null>(null)
	
	const [enterancePlate,setEnterancePlate] = useState<string|undefined>(undefined)
	const [enteranceFace,setEnteranceFace] = useState<string|undefined>(undefined)

	const [exitPlate,setExitPlate] = useState<string|undefined>(undefined)
	const [exitFace,setExitFace] = useState<string|undefined>(undefined)


	const [enteranceGateStatus,setEnteranceGateStatus] = useState(false)
	const [exitGateStatus,setExitGateStatus] = useState(false)
	return (
		<>
			<PageHeader 
				title='Gate Control'
			/>
			<div className='flex gap-4'>
				<div className='flex-1'>
					<GSection
						title='Enterance Gate Control'
						subtitle={<div className={`bg-${enteranceGateStatus?'success':'danger'}-500 text-white text-sm text-center rounded-lg py-1 px-3 w-20`}>{enteranceGateStatus?'Opened':'Closed'}</div>}
						actions={	
							<GButton
								size='sm'
								label='Start Detection'
								variant='contained'
								color='primary'
								onClick={()=>{StartEnteranceDetection()}}
							/>
						}
					>
						{true && (
							<div className='flex justify-start items-center gap-4'>
								<div className=''>
									Current Licence pic: 
								</div>
								<div className='w-28'>
									<img src={enterancePlate} alt="" />
								</div>
							</div>
						)}
						{true && (
							<div className='flex justify-start items-center gap-4'>
								<div className=''>
									Current Photo detected: 
								</div>
								<div className='w-28'>
									<img
										className={'inline-block h-10 w-10 rounded-full border-2 border-gray-300'}
										src={enteranceFace || 'https://eu.ui-avatars.com/api/?name=UknownPerson'} alt='user photo'
									/>
								</div>
							</div>
						)}
					</GSection>
				</div>
				<div className='flex-1'>
					<GSection
						title='Exit Gate Control'
						subtitle={<div className={`bg-${exitGateStatus?'success':'danger'}-500 text-white text-sm text-center rounded-lg py-1 px-3 w-20`}>{exitGateStatus?'Opened':'Closed'}</div>}
						actions={
							<GButton
								size='sm'
								label='Start Detection'
								variant='contained'
								color='primary'
								onClick={()=>{startExitDetection()}}
							/>
						}
					>
						{true && (
							<div className='flex justify-start items-center gap-4'>
								<div className=''>
									Current Licence pic: 
								</div>
								<div className='w-28'>
									<img src={exitPlate} alt="" />
								</div>
							</div>
						)}
						{true && (
							<div className='flex justify-start items-center gap-4'>
								<div className=''>
									Current Photo detected: 
								</div>
								<div className='w-28'>
									<img
										className={'inline-block h-10 w-10 rounded-full border-2 border-gray-300'}
										src={exitFace || 'https://eu.ui-avatars.com/api/?name=UknownPerson'} alt='user photo'
									/>
								</div>
							</div>
						)}
					</GSection>
				</div>
			</div>
		</>
	)
	async function StartEnteranceDetection() {
		try {
			await connectionTrail()
			const response = await http.post('Terminals/CarEntry/1')
			const enteranceResponse = response.data
		} catch (error) {
			console.log(error)
		}
	}
		
	async function startExitDetection() {
		try {
			const response = await http.post('Terminals/CarExit/2')
			const enteranceResponse = response.data
		} catch (error) {
			console.log(error)
		}
	}
	async function departureGate(id: string) {
		try {
			const response = await http.post(`Terminals/CarDeparture/${id}`)
			const enteranceResponse = response.data
		} catch (error) {
			console.log(error)
		}
	}
		
		
		
	async function connectionTrail(){
		console.log(`${process.env.REACT_APP_SERVER_URL}message`)
		try{
			const connectionq = new HubConnectionBuilder()
				.withUrl(`${process.env.REACT_APP_SERVER_URL}message`)
				.configureLogging(LogLevel.Information)
				.build()
			await connectionq.start()
			setConnection(connectionq)
			connectionq.on('sendToReact', (message) => {
				console.log('model :',message.model)
		
				console.log('status :',message.status)
				console.log('terminate :',message.terminate)
				console.log('message :',message.message)
		
			})
			
		}catch(e){
			console.log(e)
		}
	}
})





// export const Control = (props: any) => {
// 	const [enteranceState, setEnteranceState] = useState(ApiCallStates.IDLE)
// 	const [enteranceGateState, setEnteranceGateState] = useState(false)
// 	const [exitState, setExitState] = useState(ApiCallStates.IDLE)
// 	const [exitGateState, setExitGateState] = useState(false)
// 	const [connection, setConnection] = useState<HubConnection|null>(null)
// 	const [showPlate,setShowPlate] = useState(null)
// 	const path = 'F:\\Dollar.png'
// 	console.log(path)
// 	return (
// 		<>
// 			<Typography
// 				variant="h2"
// 				color="black"
// 				style={{ marginBottom: '50px', width: '30%' }}
// 			>
//         Control
// 			</Typography>

// 			<div
// 				style={{
// 					display: 'flex',
// 					justifyContent: 'space-between',
// 					borderBottom: '1px solid gray',
// 					marginBottom: '32px',
// 					width: '40%',
// 				}}
// 			>
// 				{/* entrance gate */}
// 				<Typography variant="h5" color="black" style={{}}>
//           Entrance Gate Control
// 				</Typography>
// 				<div>
//           GateStatus: <span>{enteranceGateState ? 'closed' : 'open'}</span>
// 				</div>
// 			</div>
// 			<Button onClick={() => entranceGateEnter()} variant="contained">
//         Open Gate
// 			</Button>
// 			<Button
// 				onClick={() => departureGate('1')}
// 				variant="contained"
// 				color="error"
// 				style={{ display: 'block', marginTop: '16px' }}
// 			>
//         Close Gate
// 			</Button>

// 			{true && (
// 				<div className='flex justify-start items-center gap-4'>
// 					<div className=''>
// 					Current Licence pic: 
// 					</div>
// 					<div className='w-28'>
// 						<img src={path} alt="" />
// 					</div>
// 				</div>)}
// 			<div
// 				style={{
// 					display: 'flex',
// 					justifyContent: 'space-between',
// 					borderBottom: '1px solid gray',
// 					marginBottom: '32px',
// 					marginTop: '50px',
// 					width: '40%',
// 				}}
// 			>
				
// 				{/* EXit gate */}
// 				<Typography variant="h5" color="black" style={{}}>
//           Exit Gate Control
// 				</Typography>
// 				<div>
//           GateStatus: <span>Open</span>
// 				</div>
// 			</div>
// 			<Button onClick={() => exitGateEnter()} variant="contained">
//         Open Gate
// 			</Button>
// 			<Button
// 				onClick={() => departureGate('2')}
// 				variant="contained"
// 				color="error"
// 				style={{ display: 'block', marginTop: '16px' }}
// 			>
//         Close Gate
// 			</Button>
// 		</>
// 	)
// 
// }
