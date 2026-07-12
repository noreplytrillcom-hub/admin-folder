import type { ReactNode } from 'react'
import { ArrowUpRight, MoreHorizontal, Search, SlidersHorizontal } from 'lucide-react'

export function StatCard({ title, value, change, icon, note }: {title:string;value:string;change:string;icon:ReactNode;note:string}) {
  return <div className="stat-card"><div className="stat-top"><span className="stat-icon">{icon}</span><button className="icon-btn small"><MoreHorizontal size={16}/></button></div><p>{title}</p><h2>{value}</h2><div className="stat-foot"><span className="trend"><ArrowUpRight size={13}/>{change}</span><small>{note}</small></div></div>
}

export function PageIntro({ title, text, action }: {title:string;text:string;action?:ReactNode}) {
  return <div className="page-intro"><div><h2>{title}</h2><p>{text}</p></div>{action}</div>
}

export function TableToolbar({ placeholder='Search records...' }: {placeholder?:string}) {
  return <div className="table-toolbar"><div className="table-search"><Search size={16}/><input placeholder={placeholder}/></div><button className="secondary-btn"><SlidersHorizontal size={16}/> Filters</button></div>
}

export function Status({ children, tone='green' }: {children:ReactNode;tone?:'green'|'yellow'|'red'|'blue'|'gray'}) {
  return <span className={`status ${tone}`}><i/>{children}</span>
}
