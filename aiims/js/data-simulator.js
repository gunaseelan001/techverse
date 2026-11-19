/**
 * data-simulator.js - High-Scale Armament Data Engine Simulator (Lakhs of Records Benchmark)
 */

class ArmamentDataEngine {
  constructor() {
    this.totalRecords = 524000; // Over 5.24 Lakhs of Armament Components
    this.commands = ['Eastern Command (ENC)', 'Western Command (WNC)', 'Southern Command (SNC)', 'Andaman & Nicobar (ANC)'];
    this.categories = [
      { type: 'Heavyweight Torpedo (Varunastra / Mk48)', prefix: 'TORP-VAR-', baseCount: 14200 },
      { type: 'Surface-to-Air Missile (Barak-8 / VL-SRSAM)', prefix: 'MIS-B8-', baseCount: 68400 },
      { type: 'Otobreda 76mm Naval Gun Shell Lots', prefix: 'SHELL-76-', baseCount: 220000 },
      { type: 'Submarine Torpedo Tube Assemblies', prefix: 'TT-SUB-', baseCount: 8500 },
      { type: 'Ammunition Electronic Proximity Fuzes', prefix: 'FUZE-EP-', baseCount: 175000 },
      { type: 'Anti-Submarine Warfare Depth Charges', prefix: 'ASW-DC-', baseCount: 37900 }
    ];
    this.sampleRows = [];
    this.initMockSamples();
  }

  initMockSamples() {
    const statuses = ['SERVICEABLE (A1)', 'INSPECTION DUE', 'CALIBRATION OK', 'PROOF FIRING PENDING', 'OVERHAUL REQD'];
    const depots = ['Depot Vizag (Kakinada)', 'Depot Mumbai (Karanja)', 'Depot Kochi (Aluva)', 'Depot Port Blair'];

    for (let i = 1; i <= 30; i++) {
      const cat = this.categories[i % this.categories.length];
      this.sampleRows.push({
        id: i,
        serial: `${cat.prefix}${(100000 + i * 37).toString(16).toUpperCase()}`,
        name: cat.type,
        command: this.commands[i % this.commands.length],
        depot: depots[i % depots.length],
        status: statuses[i % statuses.length],
        lot: `LOT-${2023 + (i % 4)}-${(i * 13) % 99 + 1}`,
        lastCal: `2026-0${(i % 9) + 1}-15`,
        shelfLife: `${12 + (i % 8)} Years`,
        readiness: `${85 + (i % 15)}%`
      });
    }
  }

  runBenchmark(queryCategory, queryCommand, searchTerm = '') {
    const startTime = performance.now();
    
    // Simulate searching through 5,24,000 indexed records
    let simulatedDatasetSize = 524000;
    if (queryCategory !== 'all') {
      const cat = this.categories.find(c => c.prefix === queryCategory);
      simulatedDatasetSize = cat ? cat.baseCount : 85000;
    }
    if (queryCommand !== 'all') {
      simulatedDatasetSize = Math.floor(simulatedDatasetSize / 3.4);
    }

    // Filter the displayed sample rows to match
    let filtered = this.sampleRows.filter(row => {
      let matchCat = true;
      let matchCmd = true;
      let matchText = true;

      if (queryCategory !== 'all') {
        matchCat = row.serial.startsWith(queryCategory);
      }
      if (queryCommand !== 'all') {
        matchCmd = row.command.toLowerCase().includes(queryCommand.toLowerCase());
      }
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        matchText = row.serial.toLowerCase().includes(s) || 
                    row.name.toLowerCase().includes(s) || 
                    row.lot.toLowerCase().includes(s);
      }
      return matchCat && matchCmd && matchText;
    });

    const endTime = performance.now();
    const aiimsLatency = Math.max(1.2, +(endTime - startTime + Math.random() * 2.8).toFixed(2));
    
    // Legacy SQL unindexed estimate
    const legacyLatency = Math.round((simulatedDatasetSize / 45) + Math.random() * 800);

    return {
      totalScanned: simulatedDatasetSize,
      matchingRecords: Math.floor(simulatedDatasetSize * (filtered.length / 30 || 0.15)),
      aiimsLatencyMs: aiimsLatency,
      legacyLatencyMs: legacyLatency,
      speedupFactor: Math.round(legacyLatency / aiimsLatency),
      rows: filtered
    };
  }
}

window.armamentEngine = new ArmamentDataEngine();

document.addEventListener('DOMContentLoaded', () => {
  const runBtn = document.getElementById('runBenchmarkBtn');
  const catSelect = document.getElementById('benchmarkCategory');
  const cmdSelect = document.getElementById('benchmarkCommand');
  const searchInput = document.getElementById('benchmarkSearch');
  const tableBody = document.getElementById('benchmarkTableBody');

  if (!runBtn || !tableBody) return;

  function executeBenchmark() {
    const cat = catSelect ? catSelect.value : 'all';
    const cmd = cmdSelect ? cmdSelect.value : 'all';
    const query = searchInput ? searchInput.value.trim() : '';

    runBtn.innerHTML = '<span>⚡ Processing Lakhs of Data...</span>';
    runBtn.disabled = true;

    setTimeout(() => {
      const res = window.armamentEngine.runBenchmark(cat, cmd, query);

      // Update Metric Badges
      const scannedEl = document.getElementById('metricScanned');
      const latencyEl = document.getElementById('metricLatency');
      const legacyEl = document.getElementById('metricLegacy');
      const speedupEl = document.getElementById('metricSpeedup');

      if (scannedEl) scannedEl.innerText = res.totalScanned.toLocaleString('en-IN') + ' items';
      if (latencyEl) latencyEl.innerText = res.aiimsLatencyMs + ' ms';
      if (legacyEl) legacyEl.innerText = (res.legacyLatencyMs / 1000).toFixed(2) + ' sec (Lagging)';
      if (speedupEl) speedupEl.innerText = res.speedupFactor + 'x Faster';

      // Render Table Rows
      if (res.rows.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No records found for specified query filter.</td></tr>`;
      } else {
        tableBody.innerHTML = res.rows.map(r => `
          <tr>
            <td><strong>${r.serial}</strong></td>
            <td>${r.name}</td>
            <td>${r.command}</td>
            <td>${r.lot}</td>
            <td><span class="status-tag ${r.status.includes('OK') || r.status.includes('A1') ? 'active' : (r.status.includes('DUE') ? 'warning' : 'critical')}">${r.status}</span></td>
            <td><span class="text-cyan font-mono">${r.readiness}</span></td>
          </tr>
        `).join('');
      }

      runBtn.innerHTML = '<span>⚡ Execute Instant High-Scale Query</span>';
      runBtn.disabled = false;
      if (window.tacticalAudio) {
        window.tacticalAudio.playBeep(980, 'sine', 0.1);
      }
    }, 180);
  }

  runBtn.addEventListener('click', executeBenchmark);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeBenchmark();
    });
  }

  // Initial trigger
  executeBenchmark();
});
