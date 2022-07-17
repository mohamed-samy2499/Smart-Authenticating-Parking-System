import { useState } from 'react'
import http from '../../Services/httpService'
import { observer } from 'mobx-react'
import {  GListbox,} from 'components/basic-blocks'
import { PageHeader } from 'components/page-header'
import { GateControlSection } from './gate-control-section'

export const Control =  observer(() =>{
	const [video, setVideo] = useState<any>(undefined)
	const [enteranceGate,setEnteranceGate] = useState<any>(
		{
			face:{img:undefined,info:'',status:'idle',id:''},
			plate:{img:undefined,info:'',status:'idle',id:''},
			status:false,
			message:'',
			title:'Enterance Gate Control'
		}
	)
	const [exitGate,setExitGate] = useState<any>(
		{
			face:{img:undefined,info:'',status:'idle',id:''},
			plate:{img:undefined,info:'',status:'idle',id:''},
			status:false,
			message:'',
			title:'Exit Gate Control'
		}
	)

	const options = [
		{label:'LP7',url:'./data/LP7_trimmed.mp4'},
		{label:'LP8',url:'./data/LP8_trimmed.mp4'}
	]

	const handleSelectChange = async (e:any)=>{
		setVideo(e)
		if(e){
			const formData = new FormData()
			formData.append('address', e.url)
			try{
				await http.post('http://127.0.0.1:5000/camFeed',formData)
			}catch(e){
				console.log(e)
			}
		}

	}

	return (
		<>
			<PageHeader 
				title='Gate Control'
				action={<div className='mb-4 bg-slate-100 p-2 min-w-[200px]'>
					<GListbox
						placeholder='Select plate Video'
						options={options}
						value={video}
						onChange={(e)=>handleSelectChange(e)}
						renderLabel={(e)=>e.label}
				
					/>
				</div>}
			/>
			<div className='flex gap-4'>
				<div className='flex-1'>
					<GateControlSection 
						title='Enterance Gate Control'
						gate={enteranceGate} 
						setGate={setEnteranceGate}
						key='enteranceGate'
					/>
				</div>
				{/* EXIT GATE Section */}
				<div className='flex-1'>
					<GateControlSection 
						title='Exit Gate Control'
						gate={exitGate} 
						setGate={setExitGate}		
						key='exitGate'
					/>
				</div>
			</div>
		</>
	)
})
