# Neogenesys Client

Modern React + TypeScript dashboard client built with Vite, TailwindCSS, Radix UI, and TanStack React Query.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **Radix UI** (Alert Dialog, Dialog, Dropdown Menu, Label, Select, Slot, Tooltip)
- **TanStack React Query** (+ Devtools)
- **Framer Motion**
- **Zod** (validation)
- **Axios**
- **Lucide React** (icons)
- **Sonner** (notifications)
- **ESLint** (with recommended plugins)

## Scripts

- `dev` — Start development server
- `host` — Start dev server with host
- `build` — Type-check and build for production
- `lint` — Run ESLint
- `preview` — Preview production build

## Features

- Dashboard with server and group management
- Authentication and protected routes
- User management
- Monitoring page
- Custom hooks for CRUD operations
- Context providers for Auth, Router, Server
- Form validation with Zod
- Error boundaries
- Responsive layout (Sidebar, Mobile Menu)
- UI built with Radix primitives and TailwindCSS

## Folder Structure

```
src/
  assets/           # Static assets (e.g. logo)
  components/
    common/         # Shared UI components (ErrorBoundary, Modal, etc.)
    dashboard/      # Dashboard-specific components
    layout/         # Layout components (Sidebar, MobileMenu)
    ui/             # UI primitives (button, card, dialog, etc.)
  constants/        # App constants
  context/          # React context providers
  data/             # Mock data and static data
  hooks/            # Custom React hooks
  lib/              # Query client and utilities
  pages/            # Route pages (Dashboard, Auth, etc.)
  schemas/          # Zod schemas for forms
  services/         # API service modules
  types/            # TypeScript types
  utils/            # Utility functions
public/             # Static public assets
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start development server:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```
4. **Lint code:**
   ```bash
   npm run lint
   ```

## License

MIT

## Internationalization (i18n)

- Uses **react-i18next** and **i18next** for multi-language support
- Translation files in `src/locales/` (e.g., `en.json`, `es.json`)
- Easily extendable for more languages

## Dynamic Command Forms & Server Management

- Dynamic forms for server commands (with validation, accessibility, and i18n)
- Boolean, select, and text/number parameter support
- Conditional required fields and accessibility features
- Server and group CRUD operations

## Favicon

- Place your favicon (e.g., `favicon.ico`) in the `public/` directory
- Referenced in `index.html` as:
  ```html
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  ```

## Main Custom Components & Hooks

- `src/components/dashboard/ActionPanel.tsx` — Command selection and execution panel
- `src/components/dashboard/CommandParamsForm.tsx` — Dynamic command parameter form
- `src/components/common/ModalConfirmCommand.tsx` — Confirmation modal
- `src/components/common/ModalResponseCommand.tsx` — Success modal
- `src/components/common/ModalErrorCommand.tsx` — Error modal
- `src/hooks/useCreateServer.ts`, `useRemoveServer.ts`, etc. — Custom hooks for server CRUD
- `src/context/AuthContext.tsx`, `ServerContext.tsx`, `RouterContext.tsx` — Context providers
