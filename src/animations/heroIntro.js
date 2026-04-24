import { createTimeline, stagger } from 'animejs';
import { scrollEngine } from '../utils/scrollEngine';

/**
 * HeroIntro
 * Initial entrance sequence before scrolling is enabled
 */

export const playHeroIntro = (onComplete) => {
  scrollEngine.lock();

  const tl = createTimeline({
    easing: 'easeOutExpo',
    onComplete: () => {
      scrollEngine.unlock();
      if (onComplete) onComplete();
    }
  });

  tl.add({
    targets: '.hero-char',
    translateY: [40, 0],
    opacity: [0, 1],
    delay: stagger(30),
    duration: 1200
  })
  .add({
    targets: '.hero-reveal',
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 1000
  }, '-=800')
  .add({
    targets: '.hero-background',
    opacity: [0, 1],
    scale: [1.1, 1],
    duration: 2000
  }, 0);

  tl.play(); // Explicitly start the timeline for animejs v4

  return tl;
}
