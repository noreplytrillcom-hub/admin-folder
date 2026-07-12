import { Building2, Users, Coins, Bot, ArrowUpRight, CircleDollarSign } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { StatCard, Status } from '../components/UI'

const revenue = [
  {m:'Jan',v:36000},{m:'Feb',v:41000},{m:'Mar',v:39500},{m:'Apr',v:52000},{m:'May',v:58000},{m:'Jun',v:66000},{m:'Jul',v:74200}
]
const usage = [
  {d:'Mon',v:68},{d:'Tue',v:84},{d:'Wed',v:63},{d:'Thu',v:96},{d:'Fri',v:79},{d:'Sat',v:45},{d:'Sun',v:58}
]
const customers = [
  ['Nexora Labs','Enterprise','£12,480','482K','Active'],['Plumm','Growth','£8,750','314K','Active'],['Orbit Finance','Enterprise','£7,290','264K','Active'],['VantaWorks','Scale','£5,840','193K','Trial']
]

export default function Dashboard(){
  return <>
    <div className="welcome-strip"><div><span>MONDAY, 13 JULY</span><h2>Welcome back, Zaid.</h2><p>Here is what is happening across Testo AI today.</p></div><div className="live-pill"><i/> Live data</div></div>
    <section className="stats-grid">
      <StatCard title="Monthly recurring revenue" value="£74,240" change="12.4%" note="vs last month" icon={<CircleDollarSign size={20}/>}/>
      <StatCard title="Organizations" value="248" change="8.1%" note="18 added this month" icon={<Building2 size={20}/>}/>
      <StatCard title="Active users" value="4,892" change="15.3%" note="vs last month" icon={<Users size={20}/>}/>
      <StatCard title="Credits consumed" value="2.84M" change="21.8%" note="of 3.6M allocated" icon={<Coins size={20}/>}/>
    </section>
    <section className="dashboard-grid">
      <div className="panel chart-panel span-2"><div className="panel-head"><div><h3>Revenue overview</h3><p>Monthly recurring revenue performance</p></div><select><option>Last 7 months</option></select></div><div className="chart-value"><strong>£74,240</strong><span><ArrowUpRight size={14}/>12.4%</span></div><ResponsiveContainer width="100%" height={260}><AreaChart data={revenue}><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7857ff" stopOpacity={.42}/><stop offset="100%" stopColor="#7857ff" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#202943" vertical={false}/><XAxis dataKey="m" stroke="#77809a" tickLine={false} axisLine={false}/><YAxis stroke="#77809a" tickLine={false} axisLine={false} tickFormatter={v=>`£${v/1000}k`}/><Tooltip contentStyle={{background:'#11182b',border:'1px solid #29324a',borderRadius:12}}/><Area type="monotone" dataKey="v" stroke="#8b6cff" strokeWidth={3} fill="url(#fill)"/></AreaChart></ResponsiveContainer></div>
      <div className="panel"><div className="panel-head"><div><h3>Agent activity</h3><p>Executions this week</p></div><Bot size={20}/></div><ResponsiveContainer width="100%" height={225}><BarChart data={usage}><CartesianGrid strokeDasharray="3 3" stroke="#202943" vertical={false}/><XAxis dataKey="d" stroke="#77809a" tickLine={false} axisLine={false}/><Tooltip contentStyle={{background:'#11182b',border:'1px solid #29324a',borderRadius:12}}/><Bar dataKey="v" fill="#7c5cff" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer><div className="mini-summary"><div><strong>12,842</strong><span>Total runs</span></div><div><strong>99.2%</strong><span>Success rate</span></div></div></div>
    </section>
    <section className="dashboard-grid lower">
      <div className="panel span-2"><div className="panel-head"><div><h3>Top customers</h3><p>Highest revenue organizations this month</p></div><button className="text-btn">View all</button></div><div className="table-wrap"><table><thead><tr><th>Organization</th><th>Plan</th><th>Revenue</th><th>Credits used</th><th>Status</th></tr></thead><tbody>{customers.map((r,i)=><tr key={r[0]}><td><div className="org-cell"><span>{r[0].slice(0,2).toUpperCase()}</span><strong>{r[0]}</strong></div></td><td>{r[1]}</td><td><strong>{r[2]}</strong></td><td>{r[3]}</td><td><Status tone={i===3?'yellow':'green'}>{r[4]}</Status></td></tr>)}</tbody></table></div></div>
      <div className="panel"><div className="panel-head"><div><h3>Credit distribution</h3><p>Current allocated balance</p></div></div><div className="donut-wrap"><div className="donut"><div><strong>3.6M</strong><span>Total</span></div></div><div className="legend"><p><i className="l1"/>Purchased <strong>68%</strong></p><p><i className="l2"/>Trial <strong>14%</strong></p><p><i className="l3"/>Bonus <strong>11%</strong></p><p><i className="l4"/>Promotional <strong>7%</strong></p></div></div></div>
    </section>
  </>
}
