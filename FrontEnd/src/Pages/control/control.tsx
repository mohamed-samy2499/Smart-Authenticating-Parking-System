import { useState } from 'react'
import { Button, Typography } from '@mui/material'
import { ApiCallStates } from '../../mobx-store/types'
import http from '../../Services/httpService'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { observer } from 'mobx-react'
import { GButton, GLoading, GSection } from 'components/basic-blocks'
import { PageHeader } from 'components/page-header'
import {AiFillCheckCircle, AiOutlineLoading} from 'react-icons/ai'
import {ImCross} from 'react-icons/im'



export const Control =  observer((props: any) =>{
	const [connection, setConnection] = useState<HubConnection|null>(null)
	
	const [enteranceGate,setEnteranceGate] = useState<any>(
		{
			face:{img:undefined,info:'',status:'idle'},
			plate:{img:undefined,info:'',status:'idle'},
			status:false,
		}
	)

	const [exitPlate,setExitPlate] = useState<string|undefined>(undefined)
	const [exitFace,setExitFace] = useState<string|undefined>(undefined)


	const [enteranceGateStatus,setEnteranceGateStatus] = useState(false)
	const [exitGateStatus,setExitGateStatus] = useState(false)


	console.log('enteranceGate',enteranceGate)
	return (
		<>
			<PageHeader 
				title='Gate Control'
			/>
			<div className='flex gap-4'>
				<div className='flex-1'>
					<GSection
						title='Enterance Gate Control'
						subtitle={<div className={`bg-${enteranceGate.status?'success':'danger'}-500 text-white text-sm text-center rounded-lg py-1 px-3 w-20`}>{enteranceGateStatus?'Opened':'Closed'}</div>}
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

						{/* Face Section */}
						<div className='mt-2 bg-warning-100 text-primary-900 p-4 rounded-md'>
							<h1 className=' font-bold text-2xl mb-6 bg-white inline-flex p-2 rounded-md text-primary-400'>Face module </h1>
							<div className='flex justify-start items-center gap-2'>
								<div className='font-bold'>
									Face Info: 
								</div>
								<div >
									{enteranceGate.face.info ||'Idle'}
								</div>
							</div>
							<div className='flex justify-start items-center gap-2'>
								<div className='font-bold'>
									Status: 
								</div>
								<div >
									{handleStatus(enteranceGate.face.status)}
								</div>
							</div>
							{true && (
								<div className='flex justify-start items-center gap-4'>
									<div className='font-bold'>
									Current Photo detected: 
									</div>
									<div className='w-28'>
										<img
											className={'inline-block h-10 w-10 rounded-full border-2 border-gray-300'}
											src={enteranceGate.face.img || 'https://eu.ui-avatars.com/api/?name=UknownPerson'} alt='user photo'
										/>
									</div>
								</div>
							)}
						</div>
						{/* Plate Section */}
						<div className='mt-12 bg-warning-100 text-primary-900 p-4 rounded-md'>
							<h1 className=' font-bold text-2xl mb-6 bg-white inline-flex p-2 rounded-md text-primary-400'>Plate module </h1>
							<div className='flex justify-start items-center gap-2'>
								<div className='font-bold'>
									Plate Info: 
								</div>
								<div >
									{enteranceGate.plate.info ||'Idle'}
								</div>
							</div>
							<div className='flex justify-start items-center gap-2'>
								<div className='font-bold'>
									Status: 
								</div>
								<div >
									{handleStatus(enteranceGate.plate.status)}
								</div>
							</div>
							{true && (
								<div className='flex justify-start items-center gap-2 mt-2'>
									<div className='font-bold'>
									Current Licence pic: 
									</div>
									<div className='w-28'>
										<img src={enteranceGate.plate.img} alt="" />
									</div>
								</div>
							)}
						</div>

					
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
		try{
			const connectionq = new HubConnectionBuilder()
				.withUrl(`${process.env.REACT_APP_SERVER_URL}message`)
				.configureLogging(LogLevel.Information)
				.build()
			await connectionq.start()
			setConnection(connectionq)
	
			connectionq.on('sendToReact', (res) => {
				if(res.model==='face'){
					console.log('entered face enteranceGate',res)
					setEnteranceGate((prevState:any)=>(
						{...prevState,
							face:{...prevState.face,
								img:res.imagePath ,
								info:res.message,
								status:res.status
							}
						}
					))
				}
				if(res.model==='plate'){
					console.log('entered plate enteranceGate',res)
					setEnteranceGate((prevState:any)=>(
						{...prevState,
							plate:{...prevState.plate,
								img:res.imagePath ,
								info:res.message,
								status:res.status
							}
						}
					))
				}
				if(res.terminate){
					connectionq.stop()
				}
			})
		}catch(e){
			console.log(e)
		}
	}
})

function handleStatus(status:'loading'|'success'|'failed'|'idle'){
	if(status==='loading'){
		
		return (<div className='flex gap-2 items-center'>Detecting <AiOutlineLoading className='w-5 h-5 animate-spin text-primary-500 font-bold' /></div>)
	}
	if(status==='success'){
		return (<>Successful <AiFillCheckCircle className='w-5 h-5 text-success-500'/></>)
	}
	if(status==='failed'){
		return (<>Failed <ImCross className='w-5 h-5 text-danger-500'/></>)
	}
	if(status==='idle'){
		return (<>Idle</>)
	}
}



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
