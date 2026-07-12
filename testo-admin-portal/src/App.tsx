import { Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Organizations from './pages/Organizations'
import Users from './pages/Users'
import Agents from './pages/Agents'
import Credits from './pages/Credits'
import Subscriptions from './pages/Subscriptions'
import Billing from './pages/Billing'
import Revenue from './pages/Revenue'
import Analytics from './pages/Analytics'
import Usage from './pages/Usage'
import Support from './pages/Support'
import Notifications from './pages/Notifications'
import AuditLogs from './pages/AuditLogs'
import Roles from './pages/Roles'
import Settings from './pages/Settings'

export default function App(){
  return <Routes><Route element={<AdminLayout/>}>
    <Route path="/" element={<Dashboard/>}/><Route path="/organizations" element={<Organizations/>}/>
    <Route path="/users" element={<Users/>}/><Route path="/agents" element={<Agents/>}/>
    <Route path="/credits" element={<Credits/>}/><Route path="/subscriptions" element={<Subscriptions/>}/>
    <Route path="/billing" element={<Billing/>}/><Route path="/revenue" element={<Revenue/>}/>
    <Route path="/analytics" element={<Analytics/>}/><Route path="/usage" element={<Usage/>}/>
    <Route path="/support" element={<Support/>}/><Route path="/notifications" element={<Notifications/>}/>
    <Route path="/audit-logs" element={<AuditLogs/>}/><Route path="/roles" element={<Roles/>}/>
    <Route path="/settings" element={<Settings/>}/>
  </Route></Routes>
}
