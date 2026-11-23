# AIIMS / SARATHI - Indian Navy Single-Page Exhibition Portal

## ⚓ Technical Exhibition & Naval Achievement Showcase

A clean, modern, single-page web portal demonstrating the achievements, rugged resilience, and extreme-scale ordnance lifecycle management of the **Armament Integrated Information Management System (AIIMS / SARATHI)** developed for the **Directorate General of Naval Armament Inspection (DGNAI)** and the **Indian Navy**.

---

## 🎥 Adding Your Demo Video

The front page features a prominent running video player at the top of the page.

* **Option 1 (Permanent)**: Place your video file at:
  ```
  aiims/assets/video.mp4
  ```
  It will automatically load and autoplay on the front page in a loop every time the site is opened.

* **Option 2 (Instant In-Browser Picker)**:
  Open `http://localhost:8080/` and click the **"📁 Select Local Video File"** button right below the video player to choose any video file directly from your computer. It starts playing instantly!

---

## 🌐 Running Locally

The local server is already configured and can be started anytime using Node.js:

```powershell
node .\aiims\server.js
```
Open **`http://localhost:8080/`** in your browser.

Because the site is 100% self-contained client-side, you can also double-click [index.html](file:///c:/Users/CDAC/Projects/nov11/aiims/index.html) to view it in Chrome, Edge, Firefox, or Safari.

---

## 🚀 Hosting on GitHub Pages

1. Push this repository to GitHub.
2. In your repository settings, go to **Pages**.
3. Choose **Deploy from a branch** and select your branch and root/aiims folder.
4. Your single-page site will be live at `https://<username>.github.io/<repo>/aiims/index.html`.

---

## 📋 What is Covered on This Single Page

1. **Running Video Front-Page**: Autoplaying operational video with sound controls and local video picker.
2. **Huge Data Scale (Lakhs of Records)**:
   - Lakhs of Armament Components Tracked (Torpedoes, Guided Missiles, Naval Gun Shell Lots, Proximity Fuzes, Depth Charges).
   - Millions of Ballistic Telemetry & Inspection Records.
   - Thousands of NABL-Calibrated Metrology Testing Instruments.
   - Across all 4 Naval Commands (Eastern, Western, Southern, Andaman & Nicobar).
   - Explains why managing this scale on an air-gapped secured naval site is tough.
3. **Core Operational Modules (Existing Features Only)**:
   - **Production of Arms & Armaments** (Product Trees, pyrotechnic mixing, DIDR defect tracking).
   - **Orders & Defence Contracts** (Naval indents, DPSU tenders, FAT clearance gates).
   - **Secure Rugged Devices & Offline Field Sync** (Zero-RF explosion safety, Port 9090 sync daemon).
   - **Digital Checksheets & Quality Workflows** (Mathematical tolerance enforcement: ±0.05mm).
   - **Calibrations & NABL Metrology Flows** (Automated instrument lockout when expired).
   - **Series Inspection & Proof Sentencing** (Ballistic firing analysis, SRF testing).
   - **Naval HRMS & Granular Role Access** (Naval rank hierarchy, dual-authorization).
   - **Executive Command Dashboards** (Real-time fleet combat readiness).
4. **Rugged Devices in Zero-RF Hazardous Zones**:
   - Visual flow: Offline Tablet in Magazine ➔ Docking in Client PC ➔ NCN Master Server.
5. **Defence Security & VAPT Hardening**:
   - 100% Air-gapped site readiness.
   - CERT-In compliance (Zero SQLi, Zero XSS, Zero IDOR).
   - Automated remote SFTP security audit logging.
