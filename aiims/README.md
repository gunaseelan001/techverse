# AIIMS / SARATHI - Indian Navy Armament Management Showcase

## ⚓ Technical Exhibition & Naval Achievement Portal

This web portal demonstrates the technical achievement, rugged resilience, and extreme-scale architecture of the **Armament Integrated Information Management System (AIIMS / SARATHI)** developed for the **Directorate General of Naval Armament Inspection (DGNAI)** and the **Indian Navy**.

---

## 🚀 Live Hosting on GitHub Pages

This application is **100% self-contained client-side** (HTML5, Modern CSS3, and Vanilla JavaScript with HTML5 Canvas). It has **zero server dependencies** and runs directly in any modern browser.

### Option 1: GitHub Pages from Subfolder / Root
1. If this repository is published on GitHub, navigate to **Repository Settings** > **Pages**.
2. Under **Build and deployment**, select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or current branch)
   - **Folder**: `/root` (if moving `aiims` contents to root) or specify `/aiims` if using GitHub Actions.
3. Your site will be live at `https://<username>.github.io/<repo-name>/aiims/index.html`.

### Option 2: Local Viewing (No Setup Needed)
- Simply double-click `index.html` to open it in Chrome, Edge, Firefox, or Safari!
- Or run a quick local web server:
  ```bash
  # Using Python
  cd aiims
  python -m http.server 8000

  # Or using Node
  npx serve aiims
  ```
  Then visit `http://localhost:8000`.

---

## 📂 Architecture & Directory Structure

```
aiims/
├── index.html                   # Grand Exhibition Portal & Interactive Command Center
├── modules.html                 # Deep-Dive into all 10 Mission Modules & Difficulties Explained Simply
├── digital-twin.html            # Futuristic 3D Armament Digital Twin & IoT Telemetry Simulator
├── architecture.html            # Air-Gapped Network Topology, VAPT Matrix & High Concurrency
├── presentation-mode.html       # Keynote Slideshow / Exhibition Booth Mode (Keys: Arrows, F, N)
├── css/
│   ├── navy-core.css            # Tactical theme, typography, scanlines, radar sweep, color variables
│   └── components.css          # HUD badges, simulators, metric pills, challenge/solution cards
├── js/
│   ├── navy-core.js             # Universal audio synthesis (Web Audio API), counters, tabs, RBAC
│   ├── data-simulator.js        # High-scale benchmark querying 5,24,000+ simulated armament records
│   ├── rugged-simulator.js      # Port 9090 Companion Daemon & docking station sync visualizer
│   ├── digital-twin.js          # Interactive HTML5 Canvas 3D-styled naval ordnance renderer
│   └── presentation.js          # Keynote slideshow controller with presenter notes & fullscreen
└── assets/
    └── images/                  # Authentic Naval insignias, command badges, carrier photos, NABL/NAI logos
```

---

## 🎯 Key Event Exhibition Highlights Included

1. **Lakhs-of-Data Query Engine Benchmark**:
   - Live interactive simulator scanning **5,24,000+ armament assets** (Varunastra torpedoes, Barak-8 missiles, 76mm shell lots, fuzes).
   - Demonstrates **< 15ms response time** with Neutral Parameter Indexing vs. 15+ seconds on legacy SQL joins.

2. **Zero-RF Rugged Field Sync Simulator**:
   - Interactive simulation of **Port 9090 Companion Daemon** on MIL-STD rugged tablets.
   - Live demonstration of offline inspections in underground bunkers, docking handshake, SHA-256 verification, and automatic rollback protection.

3. **10 Core Mission Modules (Difficulties Explained Simply)**:
   - **Production of Arms & Armaments** (Product Trees, pyrotechnic loading, DIDR defect tracking).
   - **Orders & Defence Contracts** (Tenders, milestone clearances, FAT inspection gating).
   - **Secure Rugged Devices** (Zero-RF explosion safety, Port 9090 updater daemon).
   - **Digital Checksheets** (Mathematical tolerance enforcement: 533.40mm ± 0.05mm).
   - **Calibrations & NABL Metrology** (Automated instrument lockdown when expired).
   - **Command Dashboards** (Real-time fleet combat readiness HUD).
   - **Inspections & Proof Testing** (Series firing analysis and sentencing algorithms).
   - **Naval HRMS & Granular RBAC** (Dual-authorization approvals, posting migration).
   - **Defence Security & VAPT** (CERT-In compliance, zero SQLi/XSS/CSRF, automated remote SFTP audit logs).
   - **Load Balancing & High Concurrency** (HAProxy/NGINX reverse proxy, zero bottlenecks).

4. **Future Horizons: 3D Armament Digital Twin**:
   - Interactive Canvas 3D-styled model of a heavyweight naval torpedo.
   - Exploded view breaking down homing head, 450kg warhead, silver-zinc battery, and propulsion motor.
   - Multi-physics simulated dials (temperature, humidity, chemical binder stability index, remaining shelf life).

5. **Exhibition Keynote Presentation Mode (`presentation-mode.html`)**:
   - Fullscreen presentation deck designed for projecting on a screen at the event booth.
   - Navigation via keyboard (`Arrow Keys`, `Space`, `F` for fullscreen, `N` for presenter notes).
