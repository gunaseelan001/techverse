/**
 * navy-core.js - Tactical Naval UI Controller & Audio Synthesis
 */

class TacticalAudio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.enabled;
  }

  playBeep(freq = 880, type = 'sine', duration = 0.08, gainVal = 0.08) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  playSonar() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Sonar sound error', e);
    }
  }
}

window.tacticalAudio = new TacticalAudio();

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll('.counter-val');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const prefix = counter.getAttribute('data-prefix') || '';
    const suffix = counter.getAttribute('data-suffix') || '';
    let count = 0;
    const speed = 2000 / target;

    const updateCount = () => {
      const increment = Math.ceil(target / 60);
      count += increment;
      if (count < target) {
        counter.innerText = prefix + count.toLocaleString('en-IN') + suffix;
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = prefix + target.toLocaleString('en-IN') + suffix;
      }
    };
    updateCount();
  });
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  // Audio toggle button
  const audioBtn = document.getElementById('audioToggleBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isEnabled = window.tacticalAudio.toggle();
      audioBtn.innerHTML = isEnabled 
        ? '<span title="Mute Tactical Audio">🔊</span>' 
        : '<span title="Enable Tactical Audio">🔇</span>';
      audioBtn.style.borderColor = isEnabled ? 'var(--cyan-primary)' : 'rgba(0, 229, 255, 0.3)';
      if (isEnabled) {
        window.tacticalAudio.playSonar();
      }
    });
  }

  // Interactive Tab Toggle for Challenge vs Solution in Module Cards
  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.cs-tab-btn');
    if (tabBtn) {
      const container = tabBtn.closest('.challenge-solution-box');
      if (!container) return;

      const targetTab = tabBtn.getAttribute('data-tab');
      const allBtns = container.querySelectorAll('.cs-tab-btn');
      const allPanels = container.querySelectorAll('.cs-panel');

      allBtns.forEach(b => {
        b.classList.remove('active');
        b.classList.remove('challenge-active');
      });
      allPanels.forEach(p => p.style.display = 'none');

      tabBtn.classList.add('active');
      if (targetTab === 'challenge') {
        tabBtn.classList.add('challenge-active');
      }

      const activePanel = container.querySelector(`.cs-panel-${targetTab}`);
      if (activePanel) {
        activePanel.style.display = 'block';
      }

      window.tacticalAudio.playBeep(650, 'triangle', 0.05);
    }
  });

  // Role Access Switcher Demo
  const roleButtons = document.querySelectorAll('.role-btn');
  if (roleButtons.length > 0) {
    const roleDetails = {
      admiral: {
        title: "Flag Officer Commanding-in-Chief (FOC-in-C)",
        desc: "Full strategic fleet visibility across all Commands (ENC, WNC, SNC, ANC). Armament readiness, ordnance war-reserves, critical defect advisories, and inter-command allocation approvals.",
        perms: [
          { name: "Strategic Armament Readiness HUD", granted: true },
          { name: "Inter-Command Transfer Authorisation", granted: true },
          { name: "Executive Sentencing Concession Approval", granted: true },
          { name: "Direct Raw Calibration Data Edit", granted: false },
          { name: "Depot Physical Stock Overwrite", granted: false },
          { name: "VAPT Security Logs Inspection", granted: true }
        ]
      },
      inspector: {
        title: "Naval Armament Inspector (NAI)",
        desc: "Autonomous verification of munitions, torpedo tube tolerances, proof firing analysis, and technical sentencing (Fit / Restricted / Overhaul / Scrap). Strict segregation prevents self-approvals.",
        perms: [
          { name: "Digital Checksheet Fill & Submit", granted: true },
          { name: "Rugged Tablet Offline Sync Execution", granted: true },
          { name: "SRF Proof Firing Report Generation", granted: true },
          { name: "Self-Approval of Own Inspection", granted: false },
          { name: "Contract Pricing Modification", granted: false },
          { name: "Calibration Deviation Flagging", granted: true }
        ]
      },
      depot: {
        title: "Naval Armament Depot Manager (NADM)",
        desc: "Oversees physical receipt, pyrotechnic explosive loading, temperature-controlled magazine storage, DIDR tracking, and order delivery milestones.",
        perms: [
          { name: "Lot Batch Receipt & Inventory Inward", granted: true },
          { name: "Underground Magazine Heatmap Telemetry", granted: true },
          { name: "Rugged Device Docking Station Dispatch", granted: true },
          { name: "Inspection Sentencing Override", granted: false },
          { name: "Master Calibration Stamp Issue", granted: false },
          { name: "Material Indent Creation", granted: true }
        ]
      },
      metrology: {
        title: "Calibration & Metrology Lead Officer",
        desc: "Ensures NABL-accredited precision for thousands of pressure transducers, master micrometers, and test benches. Controls master calibration stamps.",
        perms: [
          { name: "Master Gauge Calibration Certificate Entry", granted: true },
          { name: "Periodicity Drift Tolerance Recalibration", granted: true },
          { name: "Instrument Quarantining & De-commission", granted: true },
          { name: "Armament Firing Clearance Authorisation", granted: false },
          { name: "HRMS Posting Re-assignment", granted: false },
          { name: "NABL Metrology Audit Export", granted: true }
        ]
      }
    };

    roleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        roleButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const roleKey = btn.getAttribute('data-role');
        const data = roleDetails[roleKey];
        if (!data) return;

        const titleEl = document.getElementById('selectedRoleTitle');
        const descEl = document.getElementById('selectedRoleDesc');
        const permGrid = document.getElementById('selectedRolePerms');

        if (titleEl) titleEl.innerText = data.title;
        if (descEl) descEl.innerText = data.desc;
        if (permGrid) {
          permGrid.innerHTML = data.perms.map(p => `
            <div class="role-perm-badge ${p.granted ? 'granted' : 'denied'}">
              <span>${p.granted ? '✓' : '✕'}</span>
              <span>${p.name}</span>
            </div>
          `).join('');
        }

        window.tacticalAudio.playBeep(720, 'sine', 0.06);
      });
    });
  }

  // Trigger counters when scrolled into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const heroStats = document.querySelector('.hero-stats-strip');
  if (heroStats) {
    observer.observe(heroStats);
  }
});
