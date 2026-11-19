/**
 * presentation.js - Exhibition Booth Presentation Mode Controller
 */

class PresentationDeck {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.presentation-slide');
    this.totalSlides = this.slides.length;
    this.notesVisible = false;

    if (this.totalSlides > 0) {
      this.init();
    }
  }

  init() {
    this.updateSlide();
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        this.nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        this.prevSlide();
      } else if (e.key.toLowerCase() === 'f') {
        this.toggleFullscreen();
      } else if (e.key.toLowerCase() === 'n') {
        this.toggleNotes();
      }
    });

    const nextBtn = document.getElementById('presNextBtn');
    const prevBtn = document.getElementById('presPrevBtn');
    const fsBtn = document.getElementById('presFsBtn');
    const notesBtn = document.getElementById('presNotesBtn');

    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (fsBtn) fsBtn.addEventListener('click', () => this.toggleFullscreen());
    if (notesBtn) notesBtn.addEventListener('click', () => this.toggleNotes());
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
      this.updateSlide();
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSlide();
    }
  }

  goToSlide(idx) {
    if (idx >= 0 && idx < this.totalSlides) {
      this.currentSlide = idx;
      this.updateSlide();
    }
  }

  updateSlide() {
    this.slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === this.currentSlide);
    });

    const progressEl = document.getElementById('presProgressBar');
    if (progressEl) {
      const pct = ((this.currentSlide + 1) / this.totalSlides) * 100;
      progressEl.style.width = `${pct}%`;
    }

    const counterEl = document.getElementById('presCounter');
    if (counterEl) {
      counterEl.innerText = `${this.currentSlide + 1} / ${this.totalSlides}`;
    }

    if (window.tacticalAudio) {
      window.tacticalAudio.playBeep(840, 'triangle', 0.05);
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  toggleNotes() {
    this.notesVisible = !this.notesVisible;
    const notesElements = document.querySelectorAll('.presenter-notes');
    notesElements.forEach(n => {
      n.style.display = this.notesVisible ? 'block' : 'none';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.presentationDeck = new PresentationDeck();
});
