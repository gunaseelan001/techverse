/**
 * digital-twin.js - Futuristic Naval Armament Digital Twin & IoT Telemetry Canvas
 */

class DigitalTwinVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.angle = 0;
    this.exploded = false;
    this.explodeOffset = 0;
    this.targetOffset = 0;
    this.selectedComponent = 'all';
    this.autoRotate = true;
    
    // Telemetry mock state
    this.telemetry = {
      temp: 21.4,
      humidity: 46.2,
      vibrationG: 0.04,
      chemicalStability: 98.6,
      batteryHealth: 99.2,
      predictedLifeYears: 14.2
    };

    this.components = [
      { id: 'homing', name: 'Acoustic Active/Passive Homing Head', color: '#00e5ff', xOffset: -180, width: 70, radius: 26 },
      { id: 'warhead', name: 'High-Explosive Warhead Section (450kg)', color: '#ff5252', xOffset: -100, width: 80, radius: 28 },
      { id: 'battery', name: 'Silver-Zinc High-Energy Battery Stack', color: '#ffd740', xOffset: -10, width: 90, radius: 28 },
      { id: 'motor', name: 'Permanent Magnet Brushless Drive Engine', color: '#69f0ae', xOffset: 90, width: 80, radius: 26 },
      { id: 'rudder', name: 'Contra-Rotating Propellers & Steering Fins', color: '#b388ff', xOffset: 180, width: 60, radius: 22 }
    ];

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight || 450;
  }

  toggleExploded() {
    this.exploded = !this.exploded;
    this.targetOffset = this.exploded ? 45 : 0;
    return this.exploded;
  }

  selectComponent(compKey) {
    this.selectedComponent = compKey;
    const infoName = document.getElementById('twinCompName');
    const infoDesc = document.getElementById('twinCompDesc');
    
    const descriptions = {
      all: { name: 'Complete Naval Armament Assembly', desc: 'Real-time multi-physics Digital Twin simulating internal stress, salt-fog corrosion, and thermal stability in underground depot vaults.' },
      homing: { name: 'Acoustic Homing & Sonar Array', desc: 'Active/passive phased acoustic sensor. Monitored for transducer element sensitivity, hydrophone calibration, and signal processing health.' },
      warhead: { name: '450kg High-Explosive Warhead', desc: 'Composite energetic payload. Digital Twin tracks chemical binder degradation, void formation risks, and safety interlock circuits.' },
      battery: { name: 'Silver-Zinc Energy Battery Module', desc: 'Hermetically sealed reserve battery. Monitored for electrolyte seal integrity, voltage potential, and ambient storage temperature.' },
      motor: { name: 'High-Torque Electric Propulsion Unit', desc: 'Brushless electric drive. Monitored for shaft bearing runout, winding insulation resistance, and cooling jacket tolerances.' },
      rudder: { name: 'Contra-Rotating Propulsion & Tail Fins', desc: 'Composite hydrodynamic control surfaces with digital servo actuators. Monitored for angular backlash and cavitation wear.' }
    };

    const info = descriptions[compKey] || descriptions.all;
    if (infoName) infoName.innerText = info.name;
    if (infoDesc) infoDesc.innerText = info.desc;

    if (window.tacticalAudio) window.tacticalAudio.playBeep(780, 'sine', 0.08);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.canvas || !this.ctx) return;

    // Smooth lerp for explode offset
    this.explodeOffset += (this.targetOffset - this.explodeOffset) * 0.1;
    if (this.autoRotate) {
      this.angle += 0.008;
    }

    this.render();
  }

  render() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Subtle tactical coordinate grid
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Central crosshair & elevation circle
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);

    // 3D-styled isometric pitch
    const pitch = 0.28;
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    // Render each component of the torpedo
    this.components.forEach((comp, idx) => {
      const isSelected = this.selectedComponent === 'all' || this.selectedComponent === comp.id;
      const compExplode = (idx - 2) * this.explodeOffset;
      const compX = comp.xOffset + compExplode;

      ctx.save();
      ctx.translate(compX, 0);

      // Shadow on floor
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 100, comp.width * 0.8, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main Torpedo Cylinder Section
      const grad = ctx.createLinearGradient(0, -comp.radius * (1 - pitch), 0, comp.radius * (1 + pitch));
      if (isSelected) {
        grad.addColorStop(0, '#0a2e5c');
        grad.addColorStop(0.3, comp.color);
        grad.addColorStop(0.7, '#08203f');
        grad.addColorStop(1, '#020b18');
      } else {
        grad.addColorStop(0, '#102030');
        grad.addColorStop(1, '#050a10');
      }

      ctx.fillStyle = grad;
      ctx.strokeStyle = isSelected ? comp.color : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = isSelected ? 2 : 1;

      // Draw specialized geometry based on component
      if (comp.id === 'homing') {
        // Bullet / conical nose
        ctx.beginPath();
        ctx.moveTo(-comp.width / 2 + 10, -comp.radius * 0.7);
        ctx.bezierCurveTo(-comp.width / 2 - 25, -comp.radius * 0.5, -comp.width / 2 - 35, 0, -comp.width / 2 - 40, 0);
        ctx.bezierCurveTo(-comp.width / 2 - 35, 0, -comp.width / 2 - 25, comp.radius * 0.5, -comp.width / 2 + 10, comp.radius * 0.7);
        ctx.lineTo(comp.width / 2, comp.radius);
        ctx.lineTo(comp.width / 2, -comp.radius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (comp.id === 'rudder') {
        // Tapered aft with fins
        ctx.beginPath();
        ctx.moveTo(-comp.width / 2, -comp.radius);
        ctx.lineTo(comp.width / 2, -comp.radius * 0.4);
        ctx.lineTo(comp.width / 2, comp.radius * 0.4);
        ctx.lineTo(-comp.width / 2, comp.radius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Control fins
        ctx.fillStyle = comp.color;
        ctx.fillRect(comp.width / 2 - 15, -comp.radius - 20, 12, 22);
        ctx.fillRect(comp.width / 2 - 15, comp.radius - 2, 12, 22);
      } else {
        // Standard cylindrical bay
        ctx.beginPath();
        ctx.roundRect(-comp.width / 2, -comp.radius, comp.width, comp.radius * 2, 4);
        ctx.fill();
        ctx.stroke();

        // Internal wireframe detail rings
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.strokeRect(-comp.width / 2 + 10, -comp.radius + 4, comp.width - 20, (comp.radius - 4) * 2);
      }

      // Component label when exploded
      if (this.exploded && isSelected) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(comp.id.toUpperCase(), 0, -comp.radius - 28);

        ctx.strokeStyle = comp.color;
        ctx.beginPath();
        ctx.moveTo(0, -comp.radius - 20);
        ctx.lineTo(0, -comp.radius - 4);
        ctx.stroke();
      }

      ctx.restore();
    });

    ctx.restore();
  }
}

window.twinVis = null;

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('twinCanvas');
  if (canvas) {
    window.twinVis = new DigitalTwinVisualizer('twinCanvas');

    const explodeBtn = document.getElementById('twinExplodeBtn');
    if (explodeBtn) {
      explodeBtn.addEventListener('click', () => {
        const isExp = window.twinVis.toggleExploded();
        explodeBtn.classList.toggle('active', isExp);
        explodeBtn.innerText = isExp ? 'Assemble Assembly' : 'Exploded View';
        if (window.tacticalAudio) window.tacticalAudio.playSonar();
      });
    }

    const compButtons = document.querySelectorAll('.twin-comp-btn');
    compButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        compButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-comp');
        window.twinVis.selectComponent(key);
      });
    });
  }
});
