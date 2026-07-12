import {
  LayoutDashboard, Building2, Users, Bot, Coins, CreditCard, Receipt,
  TrendingUp, BarChart3, Activity, LifeBuoy, Bell, ScrollText, Settings, ShieldCheck
} from 'lucide-react'

export const navGroups = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: '/', icon: LayoutDashboard }],
  },
  {
    label: 'Customer Management',
    items: [
      { label: 'Organizations', path: '/organizations', icon: Building2 },
      { label: 'Users', path: '/users', icon: Users },
    ],
  },
  {
    label: 'Product & Usage',
    items: [
      { label: 'AI Agents', path: '/agents', icon: Bot },
      { label: 'Credits', path: '/credits', icon: Coins },
      { label: 'Subscriptions', path: '/subscriptions', icon: CreditCard },
      { label: 'Usage Monitoring', path: '/usage', icon: Activity },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Billing', path: '/billing', icon: Receipt },
      { label: 'Revenue', path: '/revenue', icon: TrendingUp },
      { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Support', path: '/support', icon: LifeBuoy },
      { label: 'Notifications', path: '/notifications', icon: Bell },
      { label: 'Audit Logs', path: '/audit-logs', icon: ScrollText },
      { label: 'Roles & Security', path: '/roles', icon: ShieldCheck },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
]
