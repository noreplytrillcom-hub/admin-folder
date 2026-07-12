import { Search, Bell, Plus, ChevronDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const labels: Record<string,string> = {
  '/': 'Dashboard', '/organizations':'Organizations', '/users':'Users', '/agents':'AI Agents',
  '/credits':'Credit Management', '/subscriptions':'Subscriptions', '/billing':'Billing', '/revenue':'Revenue',
  '/analytics':'Analytics', '/usage':'Usage Monitoring', '/support':'Support', '/notifications':'Notifications',
  '/audit-logs':'Audit Logs', '/roles':'Roles & Security', '/settings':'Settings'
}

export default function Header() {
  const { pathname } = useLocation()
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">TESTO AI / ADMIN</p>
        <h1>{labels[pathname] ?? 'Admin Portal'}</h1>
      </div>
      <div className="topbar-actions">
        <div className="searchbox"><Search size={17}/><input placeholder="Search anything..."/><kbd>⌘ K</kbd></div>
        <button className="icon-btn notification-btn"><Bell size={19}/><i /></button>
        <button className="primary-btn"><Plus size={17}/> Quick create <ChevronDown size={15}/></button>
      </div>
    </header>
  )
}
