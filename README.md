# Apex Task — Modern Productivity Suite & Task Manager

Apex Task is a fast, full-featured client-side task and note management suite built with **React 19**, **TypeScript**, and **Vite**. It operates completely offline as an installable **Progressive Web App (PWA)** with persistent browser storage, Web Audio sound effects, rich text editing, and natural language date parsing.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/my-todo.git
cd my-todo

# 2. Install dependencies
npm install

# 3. Start the Vite local development server
npm run dev
```

The app will be available at `http://localhost:5173/` (or the port output by Vite).

---

## 🛠️ Development & Debugging Guide

### Development Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the Vite dev server with Hot Module Replacement (HMR). |
| `npm run build` | Runs full TypeScript compiler check (`tsc -b`) and produces an optimized production build in `dist/`. |
| `npm run build:root` | Builds the app targeting root deployment (`/`). |
| `npm run build:subdir` | Builds the app targeting a subpath (`/apex-task/`, e.g., GitHub Pages). |
| `npm run preview` | Locally serves the production build output from `dist/` to test production assets and service workers. |
| `npm run lint` | Runs [Oxlint](https://oxc.rs) for fast code quality checks. |

### Debugging & Troubleshooting

1. **Local State & Storage Inspection**:
   - Apex Task stores data in browser `localStorage`.
   - To inspect or reset storage, open Browser DevTools (`F12` or `Cmd+Option+I`) -> **Application** -> **Local Storage**.
   - Keys to inspect:
     - `mytodo_tasks_v1`: All task records.
     - `mytodo_notes_v1`: Notes collection.
     - `mytodo_projects_v1`: Custom & default project definitions.
     - `mytodo_assignees_v1`: Team assignees.
     - `mytodo_tag_definitions_v1`: Custom tags with hex colors.
     - `mytodo_theme_v1`: Theme preference (`'dark'` / `'light'`).
     - `mytodo_sound_enabled`: Sound synthesizer preference.

2. **Testing PWA & Service Workers**:
   - The service worker (`service-worker.js`) is active in production builds.
   - Run `npm run build && npm run preview`, open DevTools -> **Application** -> **Service Workers** to test offline caching and updates.

3. **Backup & State Reset**:
   - Use the **Export JSON Backup** button in the Header to download your full database at any time.
   - Use **Import JSON Backup** to restore data or seed development environments.

4. **Type Checking**:
   - Always run `npm run build` before committing. TypeScript strict mode is enabled in `tsconfig.app.json`.

---

## ✨ Features & Capabilities

### 1. Multi-View Workspace
- 📋 **List View**: Clean task list featuring quick sort (Due Date, Priority, Title), inline subtask progress, and **Completion Status Filtering** (`All`, `Not Done`, `Done`).
- 📌 **Kanban Board**: Drag-and-drop / status columns (`To Do`, `In Progress`, `Done`, `Archived`).
- 🎯 **Eisenhower Matrix**: 4-quadrant urgency & importance grid (`Do First [P1]`, `Schedule [P2]`, `Delegate [P3]`, `Don't Do [P4]`).
- 📅 **Calendar View**: Interactive monthly calendar with daily schedule agenda view and category chips (`Deployment`, `Training`, `Go Live`, `Priority`).
- 📊 **Timeline / Gantt View**: Interactive roadmap timeline with multi-scale zoom (`Day`, `Week`, `Month`), scroll-to-today, horizontal panning, and subtask-driven progress tracking.
- 📝 **Notes Workspace**: Dedicated rich-text notes space with pinning, custom card colors, filter chips, and scheduled reminder banners.
- 📈 **Analytics Dashboard**: Real-time KPI cards, completion rates, active streak counters, and urgent task metrics.

### 2. Smart Task Capture & Natural Language Parsing
- **Natural Language Input**: Type `Buy groceries tomorrow at 5pm !p1 #errands @personal` to automatically parse dates, times, priority levels (`!p1` to `!p4`), tags (`#tag`), and projects (`@project`).
- **Active Project Inheritance**: Creating a task while inside any active project automatically assigns the task to that project.
- **Rich Task Inspector (`TaskDetailModal`)**: Full task editor with Quill WYSIWYG descriptions, checklist subtasks, threaded comments, recurrence rules (`daily`, `weekly`, `monthly`), and assignee picker.

### 3. Projects, Tags & Team Assignees
- **Shared Project Scoping**: Projects seamlessly organize both tasks and notes under custom colors and icons.
- **Tag Manager (`TagModal`)**: Create custom tags with dedicated color swatches or choose from curated presets.
- **Assignee Manager (`PeopleModal`)**: Manage team members with avatar initials and roles.

### 4. Productivity Tools
- ⏱️ **Pomodoro Focus Timer**: Built-in timer widget supporting Work (25m), Short Break (5m), and Long Break (15m) modes with audio ticks and floating minimized/maximized modes.
- 🔔 **Reminders & Alert Toasts**: Proactive alerts for due tasks and notes with snooze options (5m, 15m, 1h) and browser notification permission support.
- ⌨️ **Command Palette (`Cmd+K` / `Ctrl+K`)**: Rapid keyboard navigation across views, tasks, notes, projects, and tags.
- 🔊 **Web Audio Synthesizer**: Zero-asset procedural audio chimes for task completions, item creations, deletions, and pomodoro ticks.
- 🌓 **Theme Engine**: Sleek dark and clean light modes with responsive mobile bottom navigation.

---

## 📁 Architecture & File Structure

Apex Task follows a co-located, folder-per-feature architecture under `src/components/`. For full architecture diagrams, state contracts, and regression prevention guidelines, refer to:
- [`FILE_STRUCTURE.md`](./FILE_STRUCTURE.md) — Functionality architecture catalog and maintenance rules.
- [`REFACTOR_PLAN.md`](./REFACTOR_PLAN.md) — Folder organization patterns and refactoring history.
