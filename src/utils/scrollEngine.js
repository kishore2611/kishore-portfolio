/**
 * ScrollEngine
 * Maps scroll position to animation progress (0-1)
 * Includes smoothing/interpolation for cinematic feel
 */

class ScrollEngine {
  constructor() {
    this.progress = 0;
    this.targetProgress = 0;
    this.smoothing = 0.18; // More responsive, less lag
    this.isLocked = false;
    this.callbacks = [];

    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      if (this.isLocked) return;
      
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetProgress = scrollY / maxScroll;
    }, { passive: true });

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this._wasRunning = true;
        cancelAnimationFrame(this._rafId);
      } else if (this._wasRunning) {
        this._wasRunning = false;
        this.render();
      }
    });

    this.render();
  }

  render() {
    // Smooth interpolation (lerp)
    this.progress += (this.targetProgress - this.progress) * this.smoothing;
    
    // Notify subscribers
    this.callbacks.forEach(cb => cb(this.progress));

    requestAnimationFrame(() => this.render());
  }

  onUpdate(callback) {
    this.callbacks.push(callback);
  }

  lock() {
    this.isLocked = true;
    document.body.style.overflow = 'hidden';
  }

  unlock() {
    this.isLocked = false;
    document.body.style.overflow = 'auto';
  }
}

export const scrollEngine = new ScrollEngine();
