import { NavLink } from 'react-router-dom'
import { Sparkles, PanelLeftClose } from 'lucide-react'
import { navGroups } from '../data/nav'

type Props = { collapsed: boolean; onToggle: () => void }

export default function Sidebar({ collapsed, onToggle }: Props) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="brand-row">
        <div className="brand-mark"><Sparkles size={20} /></div>
        {!collapsed && <div><strong>Testo AI</strong><span>Admin Portal</span></div>}
        <button className="icon-btn sidebar-toggle" onClick={onToggle}><PanelLeftClose size={18} /></button>
      </div>
      <nav className="nav-scroll">
        {navGroups.map(group => (
          <div className="nav-group" key={group.label}>
            {!collapsed && <p>{group.label}</p>}
            {group.items.map(item => {
              const Icon = item.icon
              return (
                <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>
      <div className="admin-card">
        <div className="avatar">ZS</div>
        {!collapsed && <div><strong>Zaid Shaikh</strong><span>Super Admin</span></div>}
      </div>
    </aside>
  )
}
