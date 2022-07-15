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
			message:''
		}
	)
	const [exitGate,setExitGate] = useState<any>(
		{
			face:{img:undefined,info:'',status:'idle'},
			plate:{img:undefined,info:'',status:'idle'},
			status:false,
			message:''
		}
	)
	return (
		<>
			<PageHeader 
				title='Gate Control'
			/>
			<div className='flex gap-4'>
				<div className='flex-1'>
					<GSection
						title='Enterance Gate Control'
						actions={<div className={`bg-${enteranceGate.status?'success':'danger'}-500 text-white text-sm text-center rounded-lg py-1 px-3 w-28`}>{enteranceGate.status?'Gate Opened':' Gate Closed'}</div>}
					>
						{/* Face Section */}
						<div className='flex gap-2'>
							<GButton
								size='sm'
								label='Start Detection'
								variant='contained'
								color='primary'
								onClick={()=>{startEnteranceDetection()}}
							/>
							<GButton
								size='sm'
								label='Car Left'
								variant='contained'
								color='danger'
								onClick={()=>{departureGate('1','enter')}}
							/>
						</div>
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
									{enteranceGate.plate.img?<div className='w-28'>
										<img src={enteranceGate.plate.img} alt="" />
									</div>:'N/A'}
								</div>
							)}
						</div>		
					</GSection>
				</div>






				{/* EXIT GATE Section */}
				<div className='flex-1'>
					<GSection
						title='Exit Gate Control'
						actions={<div className={`bg-${exitGate.status?'success':'danger'}-500 text-white text-sm text-center rounded-lg py-1 px-3 w-28`}>{exitGate.status?'Gate Opened':' Gate Closed'}</div>}
					>
						{/* Face Section */}
						<div className='flex gap-2'>
							<GButton
								size='sm'
								label='Start Detection'
								variant='contained'
								color='primary'
								onClick={()=>{startExitDetection()}}
							/>
							<GButton
								size='sm'
								label='Car Left'
								variant='contained'
								color='danger'
								onClick={()=>{departureGate('1','exit')}}
							/>
						</div>	
						<div className='mt-2 bg-warning-100 text-primary-900 p-4 rounded-md'>
							<h1 className=' font-bold text-2xl mb-6 bg-white inline-flex p-2 rounded-md text-primary-400'>Face module </h1>
							<div className='flex justify-start items-center gap-2'>
								<div className='font-bold'>
									Face Info: 
								</div>
								<div >
									{exitGate.face.info ||'Idle'}
								</div>
							</div>
							<div className='flex justify-start items-center gap-2'>
								<div className='font-bold'>
									Status: 
								</div>
								<div >
									{handleStatus(exitGate.face.status)}
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
											src={exitGate.face.img || 'https://eu.ui-avatars.com/api/?name=UknownPerson'} alt='user photo'
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
									{exitGate.plate.info ||'Idle'}
								</div>
							</div>
							<div className='flex justify-start items-center gap-2'>
								<div className='font-bold'>
									Status: 
								</div>
								<div >
									{handleStatus(exitGate.plate.status)}
								</div>
							</div>
							{true && (
								<div className='flex justify-start items-center gap-2 mt-2'>
									<div className='font-bold'>
										Current Licence pic: 
									</div>
									{exitGate.plate.img?<div className='w-28'>
										<img src={exitGate.plate.img} alt="" />
									</div>:'N/A'}
								</div>
							)}
						</div>		
					</GSection>
				</div>
			</div>
		</>
	)



	async function startEnteranceDetection() {
		try {
			await enteranceGateSocket()
			await http.post('Terminals/CarEntry/1')
		} catch (error) {
			console.log(error)
		}
	}
	
	async function startExitDetection() {
		try {
			await exitGateSocket()
			await http.post('Terminals/CarExit/2')
		} catch (error) {
			console.log(error)
		}
	}

	async function departureGate(id: string,gate:'enter'|'exit') {
		try {
			await http.post(`Terminals/CarDeparture/${id}`)
			if(gate === 'enter'){
				setEnteranceGate((prevState:any)=>(
					{...prevState,status:false	}
				))
			}
			if(gate === 'exit'){
				setExitGate((prevState:any)=>(
					{...prevState,status:false	}
				))
			}
		} catch (error) {
			console.log(error)
		}
	}

	async function enteranceGateSocket(){
		try{
			const connectionq = new HubConnectionBuilder()
				.withUrl(`${process.env.REACT_APP_SERVER_URL}message`)
				.configureLogging(LogLevel.Information)
				.build()
			await connectionq.start()
			setConnection(connectionq)
	
			connectionq.on('enteranceGateDetection', (res) => {
				if(res.model==='face'){
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
				if(res.model==='gate'){
					const gate = res.status==='open'? true:res.status==='closed'?false:false
					setEnteranceGate((prevState:any)=>({...prevState,status:gate,message:res.message}))
				}
				if(res.terminate){connectionq.stop()}
			})
		}catch(e){
			console.log(e)
		}
	}

	async function exitGateSocket(){
		try{
			const connectionq = new HubConnectionBuilder()
				.withUrl(`${process.env.REACT_APP_SERVER_URL}message`)
				.configureLogging(LogLevel.Information)
				.build()
			await connectionq.start()
			setConnection(connectionq)
	
			connectionq.on('exitGateDetection', (res) => {
				if(res.model==='face'){
					console.log('entered face enteranceGate',res)
					setExitGate((prevState:any)=>(
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
					setExitGate((prevState:any)=>(
						{...prevState,
							plate:{...prevState.plate,
								img:res.imagePath ,
								info:res.message,
								status:res.status
							}
						}
					))
				}
				if(res.model==='gate'){
					console.log('Response : ',res)
					const gate = res.status==='open'? true:res.status==='closed'?false:false
					setExitGate((prevState:any)=>({...prevState,status:gate,message:res.message}))
				}
				if(res.terminate){connectionq.stop()}
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
		return (<div className='flex gap-2 items-center'>Successful <AiFillCheckCircle className='w-5 h-5 text-success-500'/></div>)
	}
	if(status==='failed'){
		return (<div className='flex gap-2 items-center'>Failed <ImCross className='w-5 h-5 text-danger-500'/></div>)
	}
	if(status==='idle'){
		return (<>Idle</>)
	}
}
