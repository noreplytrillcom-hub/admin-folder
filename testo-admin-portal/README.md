# Testo AI Admin Portal

A polished React + TypeScript admin portal based on the Testo AI PRD. It includes all core navigation pages, a responsive dark SaaS design, analytics charts, organization/user/agent management views, credit and billing operations, audit logs, roles, security, and settings.

## Stack
- React 19 + TypeScript + Vite
- React Router
- Recharts
- Lucide React icons
- Supabase client scaffold

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

Add your Supabase URL and anon key to `.env`.

## Included pages
Dashboard, Organizations, Users, AI Agents, Credits, Subscriptions, Billing, Revenue, Analytics, Usage Monitoring, Support, Notifications, Audit Logs, Roles & Security, and Settings.

## Next implementation stage
Connect each table to Supabase, add authentication and protected routes, implement CRUD dialogs, RLS policies, server-side pagination, and form validation.
