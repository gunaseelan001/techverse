/**
 * navy-core.js - Single Page Tactical Naval UI Controller & Video Integration
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
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
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

    const updateCount = () => {
      const increment = Math.ceil(target / 50);
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
  // Video element setup
  const video = document.getElementById('heroVideo');
  const videoPicker = document.getElementById('localVideoPicker');
  const chooseVideoBtn = document.getElementById('chooseVideoBtn');
  const videoAudioBtn = document.getElementById('videoAudioBtn');
  const videoStatusBadge = document.getElementById('videoStatusBadge');

  if (video) {
    // Attempt autoplay immediately
    video.play().catch(() => {
      console.log('Autoplay deferred or muted by browser policy.');
    });

    // Unmute / Mute button
    if (videoAudioBtn) {
      videoAudioBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        videoAudioBtn.innerText = video.muted ? '🔇 Unmute Video' : '🔊 Mute Video';
        if (window.tacticalAudio) window.tacticalAudio.playBeep(700, 'sine', 0.05);
      });
    }

    // Local file selector for video
    if (chooseVideoBtn && videoPicker) {
      chooseVideoBtn.addEventListener('click', () => {
        videoPicker.click();
      });

      videoPicker.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const fileURL = URL.createObjectURL(file);
          video.src = fileURL;
          video.play().catch(err => console.warn(err));
          if (videoStatusBadge) {
            videoStatusBadge.innerText = `PLAYING LOCAL: ${file.name}`;
            videoStatusBadge.classList.remove('warning');
            videoStatusBadge.classList.add('active');
          }
          if (window.tacticalAudio) window.tacticalAudio.playSonar();
        }
      });
    }
  }

  // Tactical Audio toggle button in header
  const audioBtn = document.getElementById('audioToggleBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isEnabled = window.tacticalAudio.toggle();
      audioBtn.innerHTML = isEnabled 
        ? '<span title="Mute Tactical Audio">🔊 Audio ON</span>' 
        : '<span title="Enable Tactical Audio">🔇 Audio</span>';
      audioBtn.style.borderColor = isEnabled ? 'var(--cyan-primary)' : 'rgba(0, 98, 204, 0.25)';
      if (isEnabled) {
        window.tacticalAudio.playSonar();
      }
    });
  }

  // Smooth scroll for nav anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.tacticalAudio) window.tacticalAudio.playBeep(850, 'sine', 0.04);
        }
      }
    });
  });

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

      if (window.tacticalAudio) {
        window.tacticalAudio.playBeep(650, 'triangle', 0.05);
      }
    }
  });

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
