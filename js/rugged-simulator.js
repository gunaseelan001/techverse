/**
 * rugged-simulator.js - Interactive Rugged Device Docking & Fleet Update Visualizer
 */

class RuggedFleetSimulator {
  constructor() {
    this.devices = [
      { id: 'RUG-ENC-041', station: 'Visakhapatnam Submarine Berth 3', ip: '10.184.49.201', pcIp: '10.184.49.12', version: 'v1.0.7', target: 'v1.0.8', status: 'UPDATE_AVAILABLE', battery: '92%', lastSeen: 'Just Now' },
      { id: 'RUG-WNC-108', station: 'Mumbai Karanja Underground Magazine B', ip: '10.184.50.88', pcIp: '10.184.50.15', version: 'v1.0.8', target: 'v1.0.8', status: 'UP_TO_DATE', battery: '85%', lastSeen: '2m ago' },
      { id: 'RUG-SNC-019', station: 'Kochi SRF Testing Bench Lab 2', ip: '10.184.52.44', pcIp: '10.184.52.10', version: 'v1.0.6', target: 'v1.0.8', status: 'BOOTSTRAP_REQ', battery: '78%', lastSeen: '8m ago' },
      { id: 'RUG-ANC-005', station: 'Port Blair Floating Drydock Unit', ip: '10.184.55.19', pcIp: '10.184.55.05', version: 'v1.0.7', target: 'v1.0.8', status: 'UPDATE_AVAILABLE', battery: '96%', lastSeen: '1m ago' }
    ];
    this.activeLog = [];
    this.currentRelease = {
      version: 'v1.0.8',
      artifact: 'aiims-rugged-1.0.8.jar',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      size: '48.6 MB'
    };
  }

  log(msg, type = 'info') {
    const time = new Date().toTimeString().split(' ')[0];
    this.activeLog.unshift({ time, msg, type });
    const logBox = document.getElementById('ruggedLogConsole');
    if (logBox) {
      logBox.innerHTML = this.activeLog.slice(0, 15).map(l => `
        <div class="log-line log-${l.type}">
          <span class="log-time">[${l.time}]</span> 
          <span class="log-text">${l.msg}</span>
        </div>
      `).join('');
    }
  }

  triggerUpdate(devId) {
    const dev = this.devices.find(d => d.id === devId);
    if (!dev) return;

    dev.status = 'DOWNLOAD_STARTED';
    this.renderDevices();
    this.log(`Initiating OTA update sequence for ${dev.id} from NCN VM to Client PC (${dev.pcIp})...`, 'info');

    setTimeout(() => {
      dev.status = 'UPLOAD_STARTED';
      this.renderDevices();
      this.log(`Streaming binary ${this.currentRelease.artifact} to Rugged Port 9090 Companion Daemon...`, 'info');

      setTimeout(() => {
        dev.status = 'VERIFYING_CHECKSUM';
        this.renderDevices();
        this.log(`Validating SHA-256 Checksum [${this.currentRelease.checksum.substring(0, 12)}...]`, 'info');

        setTimeout(() => {
          dev.status = 'INSTALL_STARTED';
          this.renderDevices();
          this.log(`Gracefully stopping systemd service 'aiims-client.service' & swapping jar binary...`, 'warn');

          setTimeout(() => {
            dev.status = 'HEALTH_CHECK';
            this.renderDevices();
            this.log(`Triggering localhost:9090/actuator/health probe on rugged endpoint...`, 'info');

            setTimeout(() => {
              dev.status = 'UP_TO_DATE';
              dev.version = dev.target;
              this.renderDevices();
              this.log(`SUCCESS: Device ${dev.id} running ${dev.version} with zero corruption!`, 'success');
              if (window.tacticalAudio) window.tacticalAudio.playBeep(1100, 'sine', 0.15);
            }, 1000);
          }, 1200);
        }, 1000);
      }, 1200);
    }, 1000);
  }

  triggerOfflineSync(devId) {
    const dev = this.devices.find(d => d.id === devId);
    if (!dev) return;

    this.log(`DOCKING STATION HANDSHAKE: ${dev.id} attached to physical cradle.`, 'warn');
    this.log(`Pulling 38 offline inspection records from local SQLite encrypted cache...`, 'info');
    
    setTimeout(() => {
      this.log(`Packaging cryptographic container 'sync_payload_encrypted.aisync'`, 'info');
      setTimeout(() => {
        this.log(`Differential merge completed on central AIIMS NCN Database. Status: 100% Synced.`, 'success');
        if (window.tacticalAudio) window.tacticalAudio.playSonar();
      }, 900);
    }, 800);
  }

  renderDevices() {
    const listEl = document.getElementById('ruggedDeviceList');
    if (!listEl) return;

    listEl.innerHTML = this.devices.map(d => {
      let badgeClass = 'status-tag active';
      let actionBtn = `<button class="btn-sm-action" onclick="window.ruggedSim.triggerOfflineSync('${d.id}')">⚡ Sync Data</button>`;

      if (d.status === 'UPDATE_AVAILABLE') {
        badgeClass = 'status-tag warning';
        actionBtn = `<button class="btn-sm-action update-btn" onclick="window.ruggedSim.triggerUpdate('${d.id}')">🚀 Deploy Update</button>`;
      } else if (d.status === 'BOOTSTRAP_REQ') {
        badgeClass = 'status-tag critical';
        actionBtn = `<button class="btn-sm-action" onclick="window.ruggedSim.log('Installing Daemon on ${d.id}...', 'warn')">🛠️ Init Daemon</button>`;
      } else if (d.status !== 'UP_TO_DATE') {
        badgeClass = 'status-tag warning';
        actionBtn = `<span class="spinner-inline">⏳ ${d.status}...</span>`;
      }

      return `
        <tr>
          <td><strong>${d.id}</strong><br><span style="font-size:0.7rem; color:var(--text-muted);">${d.station}</span></td>
          <td>${d.ip}<br><span style="font-size:0.7rem; color:var(--text-muted);">PC: ${d.pcIp}</span></td>
          <td><span class="mono">${d.version}</span></td>
          <td><span class="${badgeClass}">${d.status}</span></td>
          <td><span style="color:var(--emerald-success);">${d.battery}</span></td>
          <td>${actionBtn}</td>
        </tr>
      `;
    }).join('');
  }
}

window.ruggedSim = new RuggedFleetSimulator();

document.addEventListener('DOMContentLoaded', () => {
  window.ruggedSim.renderDevices();
  window.ruggedSim.log('AIIMS Rugged Device Management Subsystem initialized.', 'info');
  window.ruggedSim.log('NCN Central Server VM connected on 10.184.49.201.', 'success');
});
