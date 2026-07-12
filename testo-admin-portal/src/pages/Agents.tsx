import { Plus, Bot, Code2, Bug, Gauge, Braces, Play, Settings2 } from 'lucide-react'
import { PageIntro, Status } from '../components/UI'
const agents=[
 ['Test Case Generator','Creates structured test cases from PRDs and requirements','12 credits/run',Bot,'8,420','Active'],
 ['Regression Agent','Runs intelligent regression suites across releases','28 credits/run',Play,'5,983','Active'],
 ['API Testing Agent','Generates and executes API validation scenarios','18 credits/run',Braces,'4,218','Active'],
 ['Playwright Agent','Browser automation with resilient selectors','24 credits/run',Code2,'7,151','Active'],
 ['Bug Analysis Agent','Diagnoses failures and suggests root causes','15 credits/run',Bug,'3,409','Active'],
 ['Performance Agent','Load, stress and performance analysis','40 credits/run',Gauge,'1,286','Draft']
]
export default function Agents(){return <><PageIntro title="AI Agent Marketplace" text="Configure agents, pricing, availability and credit consumption." action={<button className="primary-btn"><Plus size={16}/> Add AI agent</button>}/><div className="agent-grid">{agents.map((a,i)=>{const Icon=a[3] as typeof Bot;return <div className="agent-card" key={a[0] as string}><div className="agent-top"><div className={`agent-icon a${i+1}`}><Icon size={23}/></div><Status tone={a[5]==='Draft'?'gray':'green'}>{a[5] as string}</Status></div><h3>{a[0] as string}</h3><p>{a[1] as string}</p><div className="agent-stats"><div><span>Pricing</span><strong>{a[2] as string}</strong></div><div><span>Runs / month</span><strong>{a[4] as string}</strong></div></div><div className="agent-actions"><button><Settings2 size={15}/> Configure</button><button className="text-btn">View usage</button></div></div>})}</div></>}
