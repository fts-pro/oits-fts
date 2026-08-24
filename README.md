# AI Innovations Enterprise Platform & Agency Portal

A modern, high-fidelity corporate digital ecosystem built for **AI Innovations**, combining a premium Swiss-minimalist public brand marketing agency website and a highly secure enterprise operations portal with advanced administrative workspaces.

The platform is designed using high-contrast typography, spacious layouts, subtle animations, and deep technical details reflecting the corporate identity of a state-of-the-art AI engineering firm.

---

## 🏗️ Architectural Overview & Core Capabilities

The codebase is structured as a unified monorepo running on **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It incorporates a dual-mode system structure optimized for search engines, client trust, and highly secure operations:

### 1. Public Agency Brand Website
Accessible via standard public URLs, this layer is composed of multiple interactive marketing blueprints and technical service disclosures:
- **Home Overview (`/`)**: Main brand anchor containing the animated `Hero` slide decks, a scrolling client tech stack `Marquee`, and high-impact client `Testimonials`.
- **Services Blueprint (`/services`)**: In-depth explanations of AI capability layers (vision networks, double-entry financial modules, handwriting ICR OCR) with detailed specifications, client impact metrics, and documentation maps.
- **Project Portfolio (`/portfolio`)**: Interactive case study directory filtering past deployments by vertical categories and individual technolgies, complete with responsive Recharts technology stack distribution diagrams.
- **Process Workflow (`/workflow`)**: A chronological stages timeline map displaying the AI Innovations development pipeline from initial technical audits to blue-green auto-scaling deployments.
- **About Firm (`/about`)**: Discloses corporate ethics compliance, clinic partnerships, team structures, and localized physical branches.
- **Contact Desk (`/contact`)**: Secure quote requesting forms with live format verification, localization details, and routing details.

### 2. Secure Workspace Control Portal (`/workspace`)
An integrated authenticated dashboard where company personnel interact with operations data. It utilizes URL-based routing matching individual operational modules:
- **Ops Control Tower (`/workspace`)**: Live telemetry monitors charting real-time system metrics, latency profiles, active API connections, and core health widgets.
- **Directory Showcase (`/workspace/showcase`)**: Live database catalog rendering server-backed client products, custom vision demos, and links to peer tunnels.
- **Conversational Vault (`/workspace/chat`)**: **[AUTH & TLS SECURED]** Peer-to-peer real-time chatting platform using End-to-End Encryption simulation with keywords filtering, message timestamps, read receipt indicators, and historical logs search.
- **Identity Dashboard (`/workspace/dashboard`)**: **[AUTH SECURED]** Personalized profile config panel allowing users to edit display avatars, adjust session limits, and modify global color themes (Light, Dark, or System Default).
- **CMS Control Panel (`/workspace/cms`)**: **[RBAC SECURED]** Administrative operations panel enabling only users with the `admin` role node to modify public case studies, append new products, and edit CMS copywriting strings live.

---

## 🔒 Security Mappings, Auth, & RBAC Specification

A high-integrity role-based access control (RBAC) topology is embedded directly into the router system:
- **Identity Authentication**: Public routes are fully browseable. In contrast, secure workspace endpoints (`/workspace/chat`, `/workspace/dashboard`, `/workspace/cms`) automatically redirect non-logged-in sessions to a secure holographic cryptographic lock state prompting Auth operations.
- **RBAC Matrix Constraints**:
  - `admin` role: Granted complete clearance over operational CMS logs, product inserts, and case studies.
  - `user` role: Granted read capabilities over logs but restricted from modifying active core tables. A clean warning states that admin credentials are required.
- **Inactivity Session Severance**: A background ticker logs users out automatically after 30 minutes of idle status. It displays an amber countdown dialog during the 29th minute, allowing users to extend their cryptographic session.
- **Secure Sandbox Keyrings**: Encrypted chat modules employ simulated AES-256 TLS peer-to-peer tunnel handshakes before displaying secure chat rooms.

---

## 📂 Monorepo Directory Layout

All website files and core modules are clean-compiled inside `/src`:

```bash
├── package.json               # Package declarations (Vite, React Router, Recharts, Motion)
├── tsconfig.json              # Compiler options mapping absolute src directories
├── tailwind.config.ts         # Utility design configurations
├── src/
│   ├── main.tsx               # App entry hook wrapping BrowserRouter
│   ├── App.tsx                # Context manager, global timeout trackers, and route dispatcher
│   ├── types.ts               # Shared database interfaces (User, CMSBlock, Service, Project)
│   ├── constants.ts           # Central immutable constants (NAV_ITEMS, SERVICES, PROJECTS)
│   ├── index.css              # Custom google typography imports & tailwind directives
│   ├── components/            # Reusable layout building blocks
│   │   ├── Header.tsx         # Brand public header with dropdown menus & theme shifts
│   │   ├── Footer.tsx         # Swiss public brand footer
│   │   ├── Hero.tsx           # Technical slide deck introduction
│   │   ├── Marquee.tsx        # Tech logo ticker
│   │   ├── Testimonials.tsx   # Verified clinic quotes
│   │   ├── Portfolio.tsx      # Case study filter grid
│   │   ├── Services.tsx       # Detail services explore lists
│   │   ├── TechStackChart.tsx # Recharts technology distribution map
│   │   ├── ProcessTimeline.tsx # Vertical step audit progression SVG
│   │   ├── ChatroomView.tsx   # Cryptographic encrypted peer-chat control
│   │   ├── OpsControlTower.tsx # Latency charts and active database connection panels
│   │   └── CMSAdminView.tsx   # Core admin modifier panels
│   └── pages/                 # Full-screen page wrappers
│       ├── AboutPage.tsx      # Mounts About & Testimonials
│       ├── ServicesPage.tsx   # Mounts Services & Processes
│       ├── PortfolioPage.tsx  # Mounts Portfolio Grid & Tech charts
│       ├── WorkflowPage.tsx   # Mounts Workflow process timeline
│       └── ContactPage.tsx    # Mounts Contact form and branches
```

---

## ⚙️ Steps to Run Locally

Follow these instructions to clone, build, and deploy the application locally:

### Prerequisites
Ensure you have **Node.js (v18.x or greater)** and **npm** installed on your system.

### 1. Ingest Dependencies
Install the required packages declared in `package.json`:
```bash
npm install
```

### 2. Fire Developer Server
Run the local Vite high-velocity developer platform server:
```bash
npm run dev
```
The application will boot and bind instantly. Open your browser and navigate to:
👉 **`http://localhost:3000`**

### 3. Generate Release Compilation
Bundle all TypeScript templates, styles, and assets into static delivery targets:
```bash
npm run build
```

### 4. Direct Production Run
Boot the release-compiled server directly:
```bash
npm run preview
```

---

## 🧪 Quick Test-Case Scenarios

Verify the implementation of modern features using these simple tests:

1. **Test Persistent Dark Scheme**:
   - Locate the theme toggle icon (Sun/Moon) in either the public Header navbar or user Settings.
   - Click it to toggle high-contrast styles. Reload your tab — the choice remains intact because it's backed by client-side `localStorage`.
2. **Test Keyboard Accessibility panel**:
   - Press **`Shift + ?`** (simultaneously) on any workspace route.
   - An elegant system overlay opens immediately, outlining mapped hotkeys. Pressing `Alt + (Number)` from `1` to `5` will change directories in the console.
3. **Test Inactivity Logouts**:
   - Navigate to `/workspace` and log in with mock credentials.
   - Set your system clock or simulate activity timers. At the 29th minute, the amber modal will appear. Pressing "LOGOUT NODE" will instantly clear your local cookie token.
4. **Test Real-Time Chat Query filtering**:
   - Navigate to `/workspace/chat` (after logging in), go to `#general`, and type multiple messages.
   - Use the embedded filtering input bar at the top of the chat area to search for keywords. The chat log will filter down instantly.
5. **Test Role-Based Access Control (RBAC)**:
   - Authenticate as a standard **`User`** node and navigate to `/workspace/cms` — notice the access denied card enforcing clearance specifications.
   - Log out, authenticate as an **`Admin`** node, and visit `/workspace/cms` — the card will disappear, and you can edit case studies and products.
