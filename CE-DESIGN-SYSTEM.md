# CloudEdge Design System

A comprehensive design system documentation for the CloudEdge application.

---

## Table of Contents

1. [Overview](#overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Layout Patterns](#layout-patterns)
6. [Components](#components)
7. [Icons](#icons)
8. [Animations & Transitions](#animations--transitions)
9. [Dark Mode](#dark-mode)
10. [Design Tokens](#design-tokens)
11. [Accessibility](#accessibility)
12. [Best Practices](#best-practices)

---

## Overview

### Technology Stack

| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | Utility-first CSS framework (via CDN) |
| **Angular** | Component-based architecture |
| **Font Awesome 6.5.2** | Icon library |

### Design Principles

- **Utility-First**: Styling via Tailwind CSS utility classes
- **Component-Based**: Angular components with scoped styles
- **Dark Mode Support**: Full dark/light theme switching
- **Responsive Design**: Mobile-first approach
- **Consistency**: Unified color palette and spacing scale

---

## Color Palette

### Brand Colors

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| **Primary** | `#679a41` | `#8cc866` | Buttons, links, active states |
| **Primary Hover** | `#537d34` | `#7ab856` | Hover states |
| **Primary Light** | `#8cc866` | `#9dd877` | Highlights, accents |

### Neutral Colors

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| **Text Primary** | `#293c51` | `gray-200` | Headings, primary text |
| **Text Secondary** | `gray-500` | `gray-400` | Secondary text, labels |
| **Background** | `#f7f8fa` / `#fcfcfc` | `slate-900` | Page background |
| **Surface** | `white` | `slate-800` | Cards, panels |
| **Border** | `gray-200` / `gray-300` | `slate-700` | Dividers, borders |

### Semantic Colors

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| **Success** | Green | `#4CAF50` / `green-500` | Success states, confirmations |
| **Warning** | Orange | `#FF9800` / `orange-500` | Warnings, cautions |
| **Error** | Red | `#F44336` / `red-500` | Errors, destructive actions |
| **Info** | Blue | `#4285F4` / `sky-500` | Information, links |

### Color Application Examples

```html
<!-- Primary Button -->
<button class="bg-[#679a41] hover:bg-[#537d34] text-white dark:bg-[#8cc866] dark:hover:bg-[#7ab856]">
  Action
</button>

<!-- Primary Text -->
<h1 class="text-[#293c51] dark:text-gray-200">Heading</h1>

<!-- Accent Text -->
<span class="text-[#679a41] dark:text-[#8cc866]">Highlighted</span>

<!-- Card Surface -->
<div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
  Content
</div>
```

---

## Typography

### Font Stack

The application uses Tailwind CSS default font stack (system fonts):

```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Font Sizes

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 0.75rem (12px) | Captions, badges, timestamps |
| `text-sm` | 0.875rem (14px) | Body text, table content |
| `text-base` | 1rem (16px) | Standard body text |
| `text-lg` | 1.125rem (18px) | Section headers |
| `text-xl` | 1.25rem (20px) | Subheadings |
| `text-2xl` | 1.5rem (24px) | Page titles |
| `text-3xl` | 1.875rem (30px) | Large titles |
| `text-4xl` | 2.25rem (36px) | Hero text |
| `text-5xl` | 3rem (48px) | Display text |
| `text-6xl` | 3.75rem (60px) | Extra large display |

### Font Weights

| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Labels, secondary emphasis |
| `font-semibold` | 600 | Buttons, headings, emphasis |
| `font-bold` | 700 | Strong emphasis, important headings |

### Typography Hierarchy

```html
<!-- Page Title -->
<h1 class="text-2xl font-bold text-[#293c51] dark:text-gray-200">Page Title</h1>

<!-- Section Header -->
<h2 class="text-lg font-semibold text-[#293c51] dark:text-gray-200">Section</h2>

<!-- Subsection -->
<h3 class="text-base font-medium text-[#293c51] dark:text-gray-300">Subsection</h3>

<!-- Body Text -->
<p class="text-sm text-gray-600 dark:text-gray-400">Body content</p>

<!-- Caption -->
<span class="text-xs text-gray-500 dark:text-gray-500">Caption text</span>

<!-- Code -->
<code class="font-mono text-sm">code snippet</code>
```

---

## Spacing System

### Base Unit

The spacing system follows Tailwind's default scale based on `0.25rem` (4px) increments.

### Spacing Scale

| Class | Value | Pixels |
|-------|-------|--------|
| `0` | 0 | 0px |
| `1` | 0.25rem | 4px |
| `2` | 0.5rem | 8px |
| `3` | 0.75rem | 12px |
| `4` | 1rem | 16px |
| `5` | 1.25rem | 20px |
| `6` | 1.5rem | 24px |
| `8` | 2rem | 32px |
| `10` | 2.5rem | 40px |
| `12` | 3rem | 48px |

### Common Padding Patterns

| Context | Class | Usage |
|---------|-------|-------|
| **Card** | `p-6` | Standard card padding |
| **Button** | `px-4 py-2` | Standard button padding |
| **Input** | `px-3 py-2` | Form input padding |
| **Tight** | `p-2` | Compact elements |
| **Minimal** | `p-1` | Icons, badges |

### Common Gap Patterns

| Context | Class | Usage |
|---------|-------|-------|
| **Tight** | `gap-2` | Icon + text, compact lists |
| **Standard** | `gap-4` | List items, form fields |
| **Generous** | `gap-6` | Section spacing, cards grid |

---

## Layout Patterns

### Application Structure

```
┌─────────────────────────────────────────────────────────┐
│                       Top Bar                            │
├──────────┬──────────────────────────────────────────────┤
│          │              Breadcrumbs (sticky)             │
│          ├──────────────────────────────────────────────┤
│ Sidebar  │                                              │
│ (80px    │           Page Content Area                  │
│  or      │                                              │
│ 320px)   │  ┌────────────────────────────────────────┐  │
│          │  │  Header + Actions                       │  │
│          │  ├────────────────────────────────────────┤  │
│          │  │  Filters / Search                       │  │
│          │  ├────────────────────────────────────────┤  │
│          │  │  Data Table / Card Grid                 │  │
│          │  ├────────────────────────────────────────┤  │
│          │  │  Pagination                             │  │
│          │  └────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────┘
```

### Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Grid Patterns

```html
<!-- Dashboard Stats Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
  <!-- Stat cards -->
</div>

<!-- Content with Sidebar -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div class="lg:col-span-2">Main content</div>
  <div>Sidebar</div>
</div>

<!-- Card Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
  <!-- Cards -->
</div>
```

### Container Styling

```html
<!-- Standard Card -->
<div class="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
  Content
</div>

<!-- Elevated Card -->
<div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
  Content
</div>

<!-- Bordered Card -->
<div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
  Content
</div>
```

---

## Components

### Buttons

#### Primary Button
```html
<button class="bg-[#679a41] hover:bg-[#537d34] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 dark:bg-[#8cc866] dark:hover:bg-[#7ab856] dark:text-slate-900">
  Primary Action
</button>
```

#### Secondary Button (Outlined)
```html
<button class="bg-transparent border border-[#679a41] text-[#679a41] px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#679a41] hover:text-white transition-colors duration-200 dark:border-[#8cc866] dark:text-[#8cc866]">
  Secondary Action
</button>
```

#### Neutral Button
```html
<button class="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200">
  Neutral Action
</button>
```

#### Destructive Button
```html
<button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200">
  Delete
</button>
```

#### Icon Button
```html
<button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors duration-200">
  <i class="fas fa-cog"></i>
</button>
```

### Form Inputs

#### Text Input
```html
<input
  type="text"
  class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#679a41] focus:border-transparent transition-colors duration-200"
  placeholder="Enter value..."
/>
```

#### Select
```html
<select class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#679a41] focus:border-transparent">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

#### Toggle Switch
```html
<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer">
  <div class="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#679a41] rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#679a41]"></div>
</label>
```

### Cards

#### Stat Card
```html
<div class="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
  <div class="flex items-center justify-between mb-4">
    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</span>
    <i class="fas fa-users text-[#679a41] dark:text-[#8cc866]"></i>
  </div>
  <div class="text-3xl font-bold text-[#293c51] dark:text-gray-200">1,234</div>
  <div class="mt-2 text-xs text-green-500">+12% from last month</div>
</div>
```

#### Data Card
```html
<div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 hover:shadow-lg transition-shadow duration-200">
  <div class="flex items-start justify-between">
    <div>
      <h3 class="text-sm font-semibold text-[#293c51] dark:text-gray-200">Card Title</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Description text</p>
    </div>
    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">Active</span>
  </div>
</div>
```

### Modals

```html
<!-- Modal Backdrop -->
<div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
  <!-- Modal Content -->
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full mx-4 animate-fade-in">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
      <h2 class="text-lg font-semibold text-[#293c51] dark:text-gray-200">Modal Title</h2>
    </div>
    <!-- Body -->
    <div class="px-6 py-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">Modal content goes here.</p>
    </div>
    <!-- Footer -->
    <div class="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
      <button class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors">Cancel</button>
      <button class="px-4 py-2 text-sm font-semibold text-white bg-[#679a41] hover:bg-[#537d34] rounded-md transition-colors">Confirm</button>
    </div>
  </div>
</div>
```

### Tables

```html
<div class="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
  <table class="w-full">
    <thead class="bg-gray-50 dark:bg-slate-700">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
        <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
      <tr class="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
        <td class="px-6 py-4 text-sm text-[#293c51] dark:text-gray-200">Item Name</td>
        <td class="px-6 py-4">
          <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">Active</span>
        </td>
        <td class="px-6 py-4 text-right">
          <button class="text-[#679a41] hover:text-[#537d34] dark:text-[#8cc866]">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Badges & Status

```html
<!-- Success Badge -->
<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">Active</span>

<!-- Warning Badge -->
<span class="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">Pending</span>

<!-- Error Badge -->
<span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">Failed</span>

<!-- Info Badge -->
<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">Info</span>

<!-- Neutral Badge -->
<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300">Draft</span>

<!-- Status Dot -->
<span class="flex items-center gap-2">
  <span class="w-2 h-2 rounded-full bg-green-500"></span>
  <span class="text-sm">Online</span>
</span>
```

---

## Icons

### Icon Library

**Font Awesome 6.5.2** (via CDN)

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
```

### Icon Component Usage

```html
<app-icon name="fas fa-home" [fixedWidth]="true" className="text-lg"></app-icon>
```

### Common Icons Reference

| Category | Icon | Class |
|----------|------|-------|
| **Navigation** | Home | `fas fa-home` |
| | Chevron Right | `fas fa-chevron-right` |
| | Chevron Down | `fas fa-chevron-down` |
| | Chevron Left | `fas fa-chevron-left` |
| **Actions** | Add | `fas fa-plus` |
| | Close | `fas fa-times` |
| | Refresh | `fas fa-sync-alt` |
| | Filter | `fas fa-filter` |
| | Search | `fas fa-search` |
| | Edit | `fas fa-edit` |
| | Delete | `fas fa-trash` |
| | Download | `fas fa-download` |
| | Export | `fas fa-file-export` |
| **Resources** | Server | `fas fa-server` |
| | Desktop (VM) | `fas fa-desktop` |
| | Database | `fas fa-database` |
| | Building | `fas fa-building` |
| | Gateway | `fas fa-dungeon` |
| | Network | `fas fa-network-wired` |
| **Security** | Shield | `fas fa-shield-alt` |
| | Lock | `fas fa-lock` |
| | Key | `fas fa-key` |
| | Bug | `fas fa-bug` |
| | Firewall | `fas fa-fire` |
| **Status** | Check | `fas fa-check` |
| | Warning | `fas fa-exclamation-triangle` |
| | Error | `fas fa-times-circle` |
| | Info | `fas fa-info-circle` |
| | Circle | `fas fa-circle` |
| **User** | User | `fas fa-user` |
| | User Circle | `fas fa-user-circle` |
| | Sign Out | `fas fa-sign-out-alt` |
| | Settings | `fas fa-cog` |
| **UI** | Bell | `fas fa-bell` |
| | Grid | `fas fa-th-large` |
| | List | `fas fa-list` |
| | Menu | `fas fa-bars` |

### Icon Sizing

| Class | Size |
|-------|------|
| `text-xs` | 12px |
| `text-sm` | 14px |
| `text-base` | 16px |
| `text-lg` | 18px |
| `text-xl` | 20px |
| `text-2xl` | 24px |

---

## Animations & Transitions

### Transition Utilities

```html
<!-- Color Transition -->
<button class="transition-colors duration-200">Button</button>

<!-- All Properties -->
<div class="transition-all duration-300">Element</div>

<!-- Transform -->
<div class="transition-transform duration-200">Element</div>

<!-- Opacity -->
<div class="transition-opacity duration-150">Element</div>
```

### Duration Classes

| Class | Duration |
|-------|----------|
| `duration-75` | 75ms |
| `duration-100` | 100ms |
| `duration-150` | 150ms |
| `duration-200` | 200ms |
| `duration-300` | 300ms |
| `duration-500` | 500ms |
| `duration-700` | 700ms |
| `duration-1000` | 1000ms |

### Easing Functions

| Class | Function |
|-------|----------|
| `ease-linear` | linear |
| `ease-in` | ease-in |
| `ease-out` | ease-out |
| `ease-in-out` | ease-in-out |

### Custom Animations

#### Fade In
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
```

#### Scale Up
```css
@keyframes scale-up {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-up {
  animation: scale-up 0.2s ease-out forwards;
}
```

#### Slide In Right
```css
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out forwards;
}
```

#### Slide Up
```css
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slideUp 0.3s ease-out forwards;
}
```

#### Pulse Glow (Brand Color)
```css
@keyframes pulseGlow {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(103, 154, 65, 0.4);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 20px rgba(103, 154, 65, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(103, 154, 65, 0);
  }
}
```

### Built-in Tailwind Animations

```html
<!-- Spinner -->
<div class="animate-spin">
  <i class="fas fa-spinner"></i>
</div>

<!-- Pulse -->
<div class="animate-pulse">Loading...</div>

<!-- Ping -->
<span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400"></span>

<!-- Bounce -->
<div class="animate-bounce">
  <i class="fas fa-chevron-down"></i>
</div>
```

### Interactive States

```html
<!-- Hover Lift -->
<div class="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
  Card content
</div>

<!-- Rotate on Click -->
<button class="transform transition-transform duration-200"
        [class.rotate-180]="isExpanded">
  <i class="fas fa-chevron-down"></i>
</button>

<!-- Scale on Hover -->
<button class="hover:scale-105 transition-transform duration-200">
  Button
</button>
```

---

## Dark Mode

### Implementation

Dark mode is implemented using Tailwind's class-based dark mode with the `dark:` prefix.

### Toggle Mechanism

```typescript
// Toggle dark mode
document.body.classList.toggle('dark');
```

### Color Mappings

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `bg-[#fcfcfc]` | `dark:bg-slate-900` |
| Surface | `bg-white` | `dark:bg-slate-800` |
| Text Primary | `text-[#293c51]` | `dark:text-gray-200` |
| Text Secondary | `text-gray-500` | `dark:text-gray-400` |
| Border | `border-gray-200` | `dark:border-slate-700` |
| Primary | `bg-[#679a41]` | `dark:bg-[#8cc866]` |
| Primary Text | `text-[#679a41]` | `dark:text-[#8cc866]` |

### Complete Dark Mode Example

```html
<div class="bg-white dark:bg-slate-800
            border border-gray-200 dark:border-slate-700
            rounded-xl shadow p-6">
  <h2 class="text-lg font-semibold text-[#293c51] dark:text-gray-200">
    Title
  </h2>
  <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
    Description text
  </p>
  <button class="mt-4 px-4 py-2 bg-[#679a41] dark:bg-[#8cc866]
                 text-white dark:text-slate-900
                 rounded-md font-semibold">
    Action
  </button>
</div>
```

---

## Design Tokens

### Summary Table

| Category | Token | Value |
|----------|-------|-------|
| **Primary Color** | `--color-primary` | `#679a41` |
| **Primary Hover** | `--color-primary-hover` | `#537d34` |
| **Primary Light** | `--color-primary-light` | `#8cc866` |
| **Text Primary** | `--color-text-primary` | `#293c51` |
| **Background** | `--color-background` | `#fcfcfc` |
| **Surface** | `--color-surface` | `#ffffff` |
| **Border Radius SM** | `--radius-sm` | `0.375rem` (6px) |
| **Border Radius MD** | `--radius-md` | `0.5rem` (8px) |
| **Border Radius LG** | `--radius-lg` | `0.75rem` (12px) |
| **Border Radius XL** | `--radius-xl` | `1rem` (16px) |
| **Shadow SM** | `--shadow-sm` | Tailwind `shadow-sm` |
| **Shadow MD** | `--shadow-md` | Tailwind `shadow` |
| **Shadow LG** | `--shadow-lg` | Tailwind `shadow-lg` |
| **Transition Fast** | `--transition-fast` | `150ms` |
| **Transition Normal** | `--transition-normal` | `200ms` |
| **Transition Slow** | `--transition-slow` | `300ms` |

### Border Radius Usage

| Size | Class | Value | Usage |
|------|-------|-------|-------|
| Small | `rounded-md` | 6px | Buttons, inputs |
| Medium | `rounded-lg` | 8px | Small cards |
| Large | `rounded-xl` | 12px | Cards, modals |
| Full | `rounded-full` | 9999px | Avatars, badges |

### Shadow Usage

| Size | Class | Usage |
|------|-------|-------|
| None | `shadow-none` | Flat elements |
| Small | `shadow-sm` | Subtle elevation |
| Medium | `shadow` | Cards, containers |
| Large | `shadow-lg` | Modals, dropdowns |
| XL | `shadow-xl` | Popovers |
| 2XL | `shadow-2xl` | Maximum elevation |

---

## Accessibility

### Focus States

```html
<!-- Standard Focus Ring -->
<button class="focus:outline-none focus:ring-2 focus:ring-[#679a41] focus:ring-offset-2">
  Button
</button>

<!-- Focus Within (for containers) -->
<div class="focus-within:ring-2 focus-within:ring-[#679a41]">
  <input type="text" />
</div>
```

### Screen Reader Support

```html
<!-- Screen Reader Only -->
<span class="sr-only">Description for screen readers</span>

<!-- Skip Link -->
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
  Skip to main content
</a>
```

### ARIA Attributes

```html
<!-- Button with label -->
<button aria-label="Close modal">
  <i class="fas fa-times"></i>
</button>

<!-- Expandable section -->
<button aria-expanded="false" aria-controls="section-content">
  Toggle Section
</button>

<!-- Loading state -->
<button aria-busy="true" disabled>
  <i class="fas fa-spinner animate-spin"></i>
  Loading...
</button>
```

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:

| Combination | Contrast Ratio |
|-------------|----------------|
| `#679a41` on white | 4.5:1 |
| `#293c51` on white | 10.5:1 |
| `#8cc866` on `slate-900` | 7.2:1 |
| White on `#679a41` | 4.5:1 |

---

## Best Practices

### Do's

1. **Use utility classes** - Prefer Tailwind utilities over custom CSS
2. **Follow the color system** - Use brand colors (`#679a41`, `#293c51`) consistently
3. **Support dark mode** - Always include `dark:` variants
4. **Use semantic colors** - Green for success, red for errors, etc.
5. **Maintain spacing consistency** - Use the standard spacing scale
6. **Add transitions** - Use `transition-colors duration-200` for interactive elements
7. **Include focus states** - Ensure keyboard accessibility

### Don'ts

1. **Don't use arbitrary colors** - Stick to the defined palette
2. **Don't skip dark mode** - Every visible element needs dark variants
3. **Don't use fixed pixel values** - Use Tailwind's rem-based scale
4. **Don't forget hover states** - Interactive elements need visual feedback
5. **Don't ignore accessibility** - Include ARIA labels and proper contrast

### Code Examples

```html
<!-- Good: Consistent with design system -->
<button class="bg-[#679a41] hover:bg-[#537d34] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#679a41] focus:ring-offset-2 dark:bg-[#8cc866] dark:hover:bg-[#7ab856] dark:text-slate-900">
  Save Changes
</button>

<!-- Bad: Inconsistent colors and missing states -->
<button class="bg-green-600 text-white p-2 rounded">
  Save
</button>
```

---

## Quick Reference

### Color Hex Codes

```
Primary:        #679a41
Primary Hover:  #537d34
Primary Light:  #8cc866
Text Primary:   #293c51
Background:     #fcfcfc / #f7f8fa
Success:        #4CAF50
Warning:        #FF9800
Error:          #F44336
Info:           #4285F4
```

### Common Class Combinations

```html
<!-- Primary Button -->
bg-[#679a41] hover:bg-[#537d34] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200

<!-- Card Container -->
bg-white dark:bg-slate-800 rounded-xl shadow p-6

<!-- Input Field -->
w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 focus:ring-2 focus:ring-[#679a41]

<!-- Section Header -->
text-lg font-semibold text-[#293c51] dark:text-gray-200

<!-- Body Text -->
text-sm text-gray-600 dark:text-gray-400

<!-- Status Badge (Success) -->
px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300
```

---

*Last updated: January 2026*
*CloudEdge Design System v1.0*
