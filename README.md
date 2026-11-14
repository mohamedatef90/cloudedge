# CloudEdge

An Angular front-end prototype of the CloudEdge cloud-management console, built as an application inside the WorldPosta SSO layout and design system. It has a collapsible sidebar, a top bar with an app launcher, and a set of management pages for resources, networking, security, and operations. Pages are driven by mock data: the code contains no calls to a backend API.

View it in AI Studio: https://ai.studio/apps/d0981ab7-8812-4f34-9fd4-1b906bad1fdc

## Pages

Routes live in `src/app.routes.ts` under `/app/cloud-edge/` and use hash-based URLs.

- **Administration:** organizations, profiles, action logs, tickets
- **Resources:** virtual machines (list, create, OS images, detail), recycle bin, marketplace, storage, reservations, getting started, community forum
- **Network:** gateways, NATs, reserved IPs, routes
- **Inventory:** applications (firewall policies), firewall groups, firewall services
- **Security:** security hub, suspicious traffic, filtering analysis, distributed firewall, gateway firewall, IDS/IPS and malware prevention
- **Operations:** scheduled tasks and groups, running tasks, backup jobs, restore requests
- A dashboard, with D3 charts on the dashboard stat modal and the security overview

The layout shell (`src/layouts/cloud-edge/`) provides the collapsible sidebar, top bar, and breadcrumbs built from the active URL. Light and dark styling is supported through Tailwind `dark:` classes.

## Tech stack

- Angular 21 (standalone components, signals, zoneless change detection)
- TypeScript 5.8
- Tailwind CSS (loaded from the CDN in `index.html`) and Font Awesome 6.5.2
- D3 7 for charts
- RxJS

## Getting started

Prerequisites: Node.js and npm.

```bash
npm install
npm run dev       # ng serve on http://localhost:3000
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build (`ng build`) |
| `npm run preview` | Dev server with the production configuration |
| `npm run lint` | Type-check with `tsc --noEmit` |

No environment variables are required, and no test framework is configured.

## Project structure

```
src/
  app.routes.ts       Route table
  layouts/cloud-edge/ Sidebar, top bar, and layout shell
  pages/              One folder per feature; services and mock-data.ts hold the sample data
  components/         Shared components (modals, breadcrumbs, filter panel, icons, splash screen)
index.tsx             Bootstrap (hash routing, zoneless change detection)
CE-DESIGN-SYSTEM.md   Design system: colors, typography, spacing, components
CLAUDE.md             Architecture notes for AI coding assistants
```
