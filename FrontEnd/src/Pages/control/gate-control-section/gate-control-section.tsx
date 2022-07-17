import { GButton, GSection } from 'components/basic-blocks'
import { useStores } from 'hooks/useStores'
import { observer } from 'mobx-react'
import {AiFillCheckCircle, AiOutlineLoading} from 'react-icons/ai'
import {ImCross} from 'react-icons/im'
import http from '../../../Services/httpService'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

export const GateControlSection = observer((props:any)=>{
	const {uiStore}=useStores()
	const {gate,setGate,id,title} = props

	return(
		<GSection
			title={title}
			subtitle={<div className='flex flex-col'>
				<div>{gate.message}</div>
			</div>}
			
			actions={	<div className='flex flex-col justify-center items-center'>
				<div className='text-xs text-gray-400 '>Gate Status</div>
				<div><div className={`bg-${gate.status?'success':'danger'}-500 text-white text-sm text-center rounded-lg py-1 px-3 w-28`}>{gate.status?'Opened':'Closed'}</div></div>
			</div>
			}
		>
		
			{/* Face Section */}
			<div className='flex justify-between'>
				<div className='flex gap-2'>	
					<GButton
						size='sm'
						label='Start Detection'
						variant='outlined'
						color='primary'
						onClick={()=>{startDetection()}}
					/>
					<GButton
						size='sm'
						label='Car Passed'
						variant='outlined'
						color='success'
						onClick={()=>{passedGate(id==='exitGate'?'2':'1')}}
						loading={uiStore.apiCallStates.gate==='loading'}
						disabled={!(gate.status===true) || uiStore.apiCallStates[id]==='loading'}
					/>
					<GButton
						size='sm'
						label='Car Left'
						variant='outlined'
						color='danger'
						onClick={()=>{departureGate(id==='exitGate'?'2':'1')}}
						loading={uiStore.apiCallStates.gate==='loading'}
						disabled={gate.face.status==='idle'|| uiStore.apiCallStates[id]==='loading'}
					/>
				</div>
				<div>
					<GButton
						size='sm'
						label={gate.status?'Close Manually':'Open Manually'}
						variant='outlined'
						color={gate.status?'danger':'success'}
						onClick={()=>{manualGateControl(id ==='exitGate'?'2':'1')}}
						loading={uiStore.apiCallStates[id]==='loading'}
						disabled={uiStore.apiCallStates[id]==='loading'}
					/>
				</div>
			</div>	
			<div className='mt-2 bg-warning-100 text-primary-900 p-4 rounded-md'>
				<h1 className=' font-bold text-2xl mb-6 bg-white inline-flex p-2 rounded-md text-primary-400'>Face module </h1>
				<div className='flex justify-start items-center gap-2'>
					<div className='font-bold'>
								Info: 
					</div>
					<div >
						{gate.face.info ||'Idle'}
					</div>
				</div>
				<div className='flex justify-start items-center gap-2'>
					<div className='font-bold'>
								Status: 
					</div>
					<div >
						{handleStatus(gate.face.status)}
					</div>
				</div>
				{true && (
					<div className='flex flex-col justify-center items-start gap-4'>
						<div className='font-bold'>
								Current Photo detected: 
						</div>

						{gate.face.img ?<div className='w-28'>
							<img
								className={'inline-block h-20 w-20 rounded-full border-2 border-gray-300'}
								src={gate.face.img || 'https://eu.ui-avatars.com/api/?name=UknownPerson'} alt='user photo'
							/>
						</div>:'N/A'}
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
						{gate.plate.info ||'Idle'}
					</div>
				</div>
				<div className='flex justify-start items-center gap-2'>
					<div className='font-bold'>
								Status: 
					</div>
					<div >
						{handleStatus(gate.plate.status)}
					</div>
				</div>
				{true && (
					<div className='flex justify-start items-center gap-2 mt-2'>
						<div className='font-bold'>
									Current Licence pic: 
						</div>
						{gate.plate.img?<div className='w-28'>
							<img src={gate.plate.img} alt="" />
						</div>:'N/A'}
					</div>
				)}
			</div>		
			
		</GSection>
	)


	async function manualGateControl(id: string) {
		try {
			uiStore.setCallState(id,'loading')
			const response = await http.post(`Terminals/manualGateControl/${id}`)
			// console.log('response.data',response.data)
			console.log('response.gagte',gate)
			setGate({...gate,status:response.data.gateState==='False'?false:true})
			uiStore.setCallState(id,'idle')
		} catch (error) {
			uiStore.setCallState(id,'error')
		}
	}
	async function passedGate(id: string) {
		try {
			uiStore.setCallState(id,'loading')
			await  http.post(`Terminals/CarEntered/${id}`,{plateId:gate.plate.id,faceId:gate.face.id})
			setGate({
				face:{img:undefined,info:'',status:'idle',id:''},
				plate:{img:undefined,info:'',status:'idle',id:''},
				status:false,
				message:'',
			})
			uiStore.setCallState(id,'idle')
		} catch (error) {
			uiStore.setCallState(id,'error')
		}
	}

	async function departureGate(id: string) {
		try {
			uiStore.setCallState(id,'loading')
			await http.post(`Terminals/CarDeparture/${id}`,{plateId:gate.plate.id,faceId:gate.face.id})
			setGate({
				face:{img:undefined,info:'',status:'idle',id:''},
				plate:{img:undefined,info:'',status:'idle',id:''},
				status:false,
				message:'',
			})
			uiStore.setCallState(id,'idle')
		} catch (error) {
			uiStore.setCallState(id,'error')
		}
	}
	async function startDetection() {
		const ids = id ==='exitGate'?'2':'1'
		const url = id ==='exitGate'?'CarExit':'CarEntry'
		console.log('exitGate',ids)
		try {
			await gateSocket()
			await http.post(`Terminals/${url}/${ids}`)
		} catch (error) {
			console.log(error)
		}
	}

	async function gateSocket(){
		const functionName = id==='exitGate'?'exitGateDetection':'enteranceGateDetection'
		console.log('functionName',functionName)
		try{
			const connectionq = new HubConnectionBuilder()
				.withUrl(`${process.env.REACT_APP_SERVER_URL}message`)
				.configureLogging(LogLevel.Information)
				.build()
			await connectionq.start()	
			connectionq.on(functionName, (res:any) => {
				if(res.model==='face'){
					if(res.status==='success'){
						setGate((prevState:any)=>(
							{...prevState,
								face:{...prevState.face,
									id:res.message.split(':')[1]
								}
							}
						))
					}
					setGate((prevState:any)=>(
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
					if(res.status==='success'){
						setGate((prevState:any)=>(
							{...prevState,
								plate:{...prevState.plate,
									id:res.message.split(':')[1]
								}
							}
						))
					}
					setGate((prevState:any)=>(
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
					setGate((prevState:any)=>({...prevState,status:gate,message:res.message}))
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
