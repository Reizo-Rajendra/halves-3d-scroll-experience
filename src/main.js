import { SceneManager } from './scene.js';
import { AnimationController } from './animation.js';

/**
 * Application Entry Point & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('webgl-container');
  if (!container) return;

  // 1. Initialize Three.js Scene
  const sceneManager = new SceneManager(container);

  // 2. Initialize Lenis + GSAP Scrollytelling Animation
  const animationController = new AnimationController(sceneManager);

  // 3. Audio Synth & Fizz Sound Effects
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let isSoundActive = false;
  const soundBtn = document.getElementById('sound-btn');

  function playCanFizzSound() {
    if (!isSoundActive) return;
    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Can tab "Crack" impulse
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.08);

      // Effervescent carbonation "Fizz"
      const bufferSize = audioContext.sampleRate * 0.8;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = audioContext.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioContext.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 4500;

      const fizzGain = audioContext.createGain();
      fizzGain.gain.setValueAtTime(0.18, now + 0.04);
      fizzGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      whiteNoise.connect(filter);
      filter.connect(fizzGain);
      fizzGain.connect(audioContext.destination);
      whiteNoise.start(now + 0.04);
    } catch (err) {
      console.warn('Audio playback not permitted yet:', err);
    }
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      isSoundActive = !isSoundActive;
      if (isSoundActive) {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        soundBtn.style.background = 'var(--color-melon-red)';
        soundBtn.style.color = '#ffffff';
        playCanFizzSound();
      } else {
        soundBtn.style.background = '';
        soundBtn.style.color = '';
      }
    });
  }

  // 4. YouTube & Creator Showcase Actions
  const ytBtn = document.getElementById('yt-btn');
  const shareBtn = document.getElementById('share-btn');

  if (ytBtn) {
    ytBtn.addEventListener('click', () => {
      playCanFizzSound();
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      playCanFizzSound();
      try {
        await navigator.clipboard.writeText(window.location.href);
        const orig = shareBtn.innerHTML;
        shareBtn.innerHTML = `<span>Copied! Ready to share</span>`;
        shareBtn.style.background = 'rgba(255, 0, 0, 0.3)';
        shareBtn.style.borderColor = 'rgba(255, 0, 0, 0.6)';
        shareBtn.style.color = '#ffffff';
        setTimeout(() => {
          shareBtn.innerHTML = orig;
          shareBtn.style.background = '';
          shareBtn.style.borderColor = '';
          shareBtn.style.color = '';
        }, 2000);
      } catch (e) {
        alert('Website Link: ' + window.location.href);
      }
    });
  }
});
