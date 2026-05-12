# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build locally
npm run lint         # TypeScript type checking (tsc --noEmit)
```

No test framework is currently configured.

## Stack

- **Angular 21.2** — standalone components only (no NgModules)
- **TypeScript 5.8** — ES2022 target
- **Tailwind CSS** — loaded via CDN in `index.html`
- **Angular Signals** — primary state management (`signal`, `computed`, `effect`)
- **RxJS 7.8.2** with `toSignal()` adapter
- **D3.js 7.9.0** for charts/visualizations
- **Vite 6.2.0** build tool
- **Zoneless change detection** — enabled globally via `provideZonelessChangeDetection()`
- **Hash-based routing** — no server-side routing needed

## Architecture

### Route Organization

All authenticated routes live under `/app/cloud-edge/` as children of `CloudEdgeLayoutComponent`. Domains:

- **Administration**: Organizations, Profiles, Action Logs, Tickets
- **Resources**: Virtual Machines, Storage, Marketplace, Reservations
- **Network**: Gateways, NATs, Routes, Reserved IPs
- **Inventory**: Applications (Firewall Policies), Groups, Services
- **Security**: Security Hub, Suspicious Traffic, Distributed/Gateway Firewall, IDS/IPS
- **Operations**: Scheduled Tasks, Backup Jobs, Restore Requests

Routes are in `src/app.routes.ts`. The layout component auto-generates breadcrumbs by parsing the active URL path.

### Layout Shell

`src/layouts/cloud-edge/cloud-edge-layout.component.ts` is the authenticated shell containing:
- Collapsible sidebar (state persisted to `localStorage` key `cloudEdgeSidebarCollapsed`)
- Top bar with app launcher and user menu
- Sticky breadcrumbs auto-generated from route URL

### Feature Page Structure

Each feature under `src/pages/{feature}/` follows this pattern:
```
virtual-machines/
├── virtual-machines.component.ts   # Main page, OnPush, signals-based
├── services/virtual-machine.service.ts  # Mock data + signal state
├── components/                     # Feature-specific sub-components
├── pages/                          # Child routes (create, edit, detail)
└── mock-data.ts                    # Static mock data for dev
```

### Component Pattern

All components are standalone with `ChangeDetectionStrategy.OnPush`:

```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, IconComponent, ...],
})
export class ExampleComponent {
  private service = inject(ExampleService);

  items = signal<Item[]>([]);
  searchTerm = signal('');
  filtered = computed(() =>
    this.items().filter(i => i.name.includes(this.searchTerm()))
  );
}
```

Prefer `inject()` over constructor injection. Use `input()` over `@Input()` for simple props.

### Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleService {
  private _items = signal<Item[]>(mockItems);
  items = this._items.asReadonly();

  add(item: Item) { this._items.update(prev => [...prev, item]); }
}
```

No HTTP client is currently used — all data is mocked.

### Auth

`src/services/auth.service.ts` is mock-only and hardcoded to the `admin` role. Four roles exist: `customer`, `admin`, `reseller`, `micro`.

## Design System

See **CE-DESIGN-SYSTEM.md** for complete design guidelines.

### Color Tokens (not in Tailwind config — use hex directly)

| Token | Light | Dark |
|---|---|---|
| Primary | `#679a41` | `#8cc866` |
| Primary Hover | `#537d34` | `#7ab856` |
| Text Primary | `#293c51` | `gray-200` |
| Background | `#f7f8fa` | `slate-900` |
| Surface | `white` | `slate-800` |

### Recurring Tailwind Patterns

```html
<!-- Card -->
<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">

<!-- Primary button -->
<button class="bg-[#679a41] text-white px-6 py-2.5 rounded-md hover:bg-[#537d34] dark:bg-[#8cc866] dark:hover:bg-[#7ab856]">

<!-- Sticky header with blur -->
<div class="sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b">
```

Icons use Font Awesome classes (e.g., `fas fa-server`).

## Key Files

| File | Purpose |
|---|---|
| `src/app.routes.ts` | All 40+ routes |
| `src/main.ts` | Bootstrap — zoneless + hash routing |
| `src/app.component.ts` | Root with splash screen gate |
| `src/layouts/cloud-edge/` | Main authenticated shell |
| `src/types/index.ts` | Global shared types (`User`, `BreadcrumbItem`, `NavItem`, etc.) |
| `src/services/auth.service.ts` | Mock auth |
| `src/services/dashboard-animation.service.ts` | Intro animation + welcome card via localStorage |

## Adding a New Page

1. Create `src/pages/{feature}/` with component + service + mock-data
2. Add route in `src/app.routes.ts` under the appropriate domain section
3. Add sidebar nav entry in `src/layouts/cloud-edge/components/sidebar/sidebar.component.ts`
4. Use lazy loading: `loadComponent: () => import('./pages/...').then(m => m.Component)`

The breadcrumb label for a route is derived from the URL segment by replacing hyphens with spaces and title-casing — no additional configuration needed.
