import { createTimeline } from 'animejs';

/**
 * MasterTimeline
 * Single source of truth for all scroll-driven animations
 */

export const masterTimeline = createTimeline({
  autoplay: false,
  easing: 'linear', // Important for smooth scroll mapping
  duration: 1000 // Multiplier for percentage-based timing
});

// Helper to add a section to the timeline
// start & end are 0-1 range
export const addSectionAnimation = (targets, props, start, end) => {
  masterTimeline.add({
    targets,
    ...props,
  }, start * 1000);
};

// Update function to be called by ScrollEngine
export const updateMasterTimeline = (progress) => {
  if (masterTimeline) {
    masterTimeline.seek(progress * 1000);
  }
};

// Initial Setup - Map sections to the timeline
export const initMasterTimeline = () => {
  // 0.0 - 0.15: Hero Scroll Out
  masterTimeline.add({
    targets: '#home > div',
    opacity: [1, 0],
    translateY: [0, -100],
    duration: 150
  }, 0);

  // 0.15 - 0.30: Stats Scroll In/Out
  masterTimeline.add({
    targets: '#stats',
    opacity: [0, 1, 0],
    translateY: [100, 0, -100],
    duration: 150
  }, 150);

  // 0.30 - 0.45: GitHub Scroll In/Out
  masterTimeline.add({
    targets: '#github',
    opacity: [0, 1, 0],
    translateY: [100, 0, -100],
    duration: 150
  }, 300);

  // 0.45 - 0.60: Experience/Skills
  masterTimeline.add({
    targets: '#experience, #skills',
    opacity: [0, 1, 0],
    translateY: [100, 0, -100],
    duration: 150
  }, 450);

  // 0.60 - 0.75: Projects
  masterTimeline.add({
    targets: '#projects',
    opacity: [0, 1, 0],
    translateY: [100, 0, -100],
    duration: 150
  }, 600);

  // 0.75 - 0.90: System/Code
  masterTimeline.add({
    targets: '#system-design, #code',
    opacity: [0, 1, 0],
    translateY: [100, 0, -100],
    duration: 150
  }, 750);

  // 0.90 - 1.0: Contact
  masterTimeline.add({
    targets: '#contact',
    opacity: [0, 1],
    translateY: [100, 0],
    duration: 100
  }, 900);
};
