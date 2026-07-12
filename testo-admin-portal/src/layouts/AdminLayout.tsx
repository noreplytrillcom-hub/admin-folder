import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <main className="main-shell"><Header/><div className="page-content"><Outlet/></div></main>
    </div>
  )
}
