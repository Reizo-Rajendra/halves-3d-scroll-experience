import * as THREE from 'three';
import Lenis from 'lenis';

export class AnimationController {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.svgContainer = document.getElementById('connector-svg');
    this.lines = [
      document.getElementById('line-top'),
      document.getElementById('line-mid'),
      document.getElementById('line-bot')
    ];
    this.dots = [
      document.getElementById('dot-top'),
      document.getElementById('dot-mid'),
      document.getElementById('dot-bot')
    ];
    this.labels = [
      document.getElementById('label-top'),
      document.getElementById('label-mid'),
      document.getElementById('label-bot')
    ];
    this.counters = [
      document.getElementById('counter-top'),
      document.getElementById('counter-mid'),
      document.getElementById('counter-bot')
    ];
    this.counterCal = document.getElementById('counter-cal');
    this.appBg = document.getElementById('app-bg');

    this.initLenis();
  }

  initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0
    });

    this.scroll = 0;
    this.maxScroll = 1;

    this.lenis.on('scroll', (e) => {
      this.scroll = e.scroll;
      this.maxScroll = e.limit || (document.documentElement.scrollHeight - window.innerHeight);
    });

    const raf = (time) => {
      this.lenis.raf(time);
      this.updateAnimations(time * 0.001);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  updateAnimations(time) {
    const totalH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalH > 0 ? Math.min(1, Math.max(0, window.scrollY / totalH)) : 0;

    this.sm.update(time);

    this.animateBackground(progress);

    if (progress < 0.18) {
      // SECTION 1: HERO [0.00 - 0.18]
      const p = progress / 0.18;
      this.sm.canSystem.updateSplit(0);
      this.sm.canSystem.group.position.set(0, 0, 0);
      // Front label (HALVES) faces forward
      this.sm.canSystem.group.rotation.set(0, Math.PI, 0);

      // Exact matching fruit positions from frame_00.jpg:
      // Watermelon wedge left, lime cluster left, watermelon disc right, lime slice right
      this.sm.heroWatermelonLeft.position.x = -2.05 - (1 - p) * 0.15;
      this.sm.heroWatermelonRight.position.x = 1.95 + (1 - p) * 0.15;
      this.sm.limeCluster.position.set(-1.42 - (1 - p) * 0.1, -0.92, 0.65);
      this.sm.heroLimeSlice.position.set(1.15, -0.65, 0.55);
      if (this.sm.heroLimeFloorSlice) {
        this.sm.heroLimeFloorSlice.position.set(0.65, -1.20, 1.35);
      }

      // Safe foreground crystal jelly cubes (Zero clipping with can!)
      if (this.sm.heroJelly1) {
        this.sm.heroJelly1.scale.set(1, 1, 1);
        this.sm.heroJelly1.position.set(
          -0.75 - (1 - p) * 0.10,
          -1.16 + Math.sin(time * 2.0) * 0.012,
          1.32
        );
        this.sm.heroJelly1.rotation.set(0.12, 0.55 + time * 0.05, 0.08);
      }
      if (this.sm.heroJelly2) {
        this.sm.heroJelly2.scale.set(1, 1, 1);
        this.sm.heroJelly2.position.set(
          1.38 + (1 - p) * 0.10,
          -1.18 + Math.cos(time * 2.2) * 0.010,
          1.08
        );
        this.sm.heroJelly2.rotation.set(-0.15, 0.82 - time * 0.05, 0.22);
      }

      this.hideConnectors();
    } else if (progress >= 0.18 && progress < 0.38) {
      // SECTION 2: THREE INGREDIENTS - THE SLICING (Exact TikTok Creator Formula)
      const p = (progress - 0.18) / 0.20;

      // band i moves y = (i - 1) * 0.6 * p
      // rotation.y = (i - 1) * 0.15 * p
      this.sm.canSystem.updateSplit(p);
      // Can moves slightly to center-left as it splits (matching video frame_30.jpg)
      this.sm.canSystem.group.position.set(-0.3 * p, 0, 0);
      this.sm.canSystem.group.rotation.set(0, Math.PI, 0);

      // Limes stay tight on the left, watermelons slide off-screen
      this.sm.limeCluster.position.set(-1.42 - 0.08 * p, -0.92, 0.65);
      this.sm.heroWatermelonLeft.position.x = -2.05 - p * 1.5;
      this.sm.heroWatermelonRight.position.x = 2.05 + p * 1.5;
      this.sm.heroLimeSlice.position.set(1.15 + p * 1.5, -0.65, 0.55);
      if (this.sm.heroLimeFloorSlice) {
        this.sm.heroLimeFloorSlice.position.set(0.65 + p * 1.5, -1.20, 1.35);
      }

      // Jelly cubes dynamically glide outward as the can splits open, enhancing the action!
      if (this.sm.heroJelly1) {
        this.sm.heroJelly1.scale.set(1 - p * 0.35, 1 - p * 0.35, 1 - p * 0.35);
        this.sm.heroJelly1.position.set(
          -0.75 - p * 1.6,
          -1.16 - p * 0.25,
          1.32 + p * 0.35
        );
        this.sm.heroJelly1.rotation.y = 0.55 + p * 1.2;
      }
      if (this.sm.heroJelly2) {
        this.sm.heroJelly2.scale.set(1 - p * 0.35, 1 - p * 0.35, 1 - p * 0.35);
        this.sm.heroJelly2.position.set(
          1.38 + p * 1.6,
          -1.18 - p * 0.25,
          1.08 + p * 0.35
        );
        this.sm.heroJelly2.rotation.y = 0.82 - p * 1.2;
      }

      this.updateConnectors(p);
    } else if (progress >= 0.38 && progress < 0.58) {
      // SECTION 3: LIGHTLY SPARKLING (180° ROTATION TO SHOW BACK OF CAN)
      const p = (progress - 0.38) / 0.20;
      this.hideConnectors();

      this.sm.canSystem.updateSplit(0);
      // Smoothly rotate 180 degrees from Math.PI to 2*Math.PI to show back label
      this.sm.canSystem.group.rotation.y = Math.PI + Math.PI * p;
      // Slight lateral drift as the can rotates - matches video frame_45.jpg (can is to the right)
      this.sm.canSystem.group.position.set(0.65 * Math.sin(p * Math.PI), 0, 0.3 * Math.sin(p * Math.PI));

      this.sm.limeCluster.position.set(-1.42, -0.92, 0.65);
      this.sm.heroWatermelonLeft.position.set(-3.6, -0.42, 0.35);
      this.sm.heroWatermelonRight.position.set(3.6, -0.22, 0.05);
      this.sm.heroLimeSlice.position.set(2.65, -0.65, 0.55);
      if (this.sm.heroLimeFloorSlice) {
        this.sm.heroLimeFloorSlice.position.set(2.15, -1.20, 1.35);
      }
      if (this.sm.heroJelly1) {
        this.sm.heroJelly1.scale.set(0.001, 0.001, 0.001);
        this.sm.heroJelly1.position.set(-4.5, -1.2, 1.32);
      }
      if (this.sm.heroJelly2) {
        this.sm.heroJelly2.scale.set(0.001, 0.001, 0.001);
        this.sm.heroJelly2.position.set(4.5, -1.2, 1.08);
      }
      this.sm.orbitGroup.scale.set(0.001, 0.001, 0.001);
    } else if (progress >= 0.58 && progress < 0.76) {
      // SECTION 4: WATERMELON ORBIT (REVOLVING FRUIT SLICES) — GREEN SCREEN
      const p = (progress - 0.58) / 0.18;
      this.hideConnectors();
      this.sm.canSystem.updateSplit(0);

      // Can slowly rotates as orbit expands - match frame_60.jpg
      this.sm.canSystem.group.rotation.y = 2 * Math.PI + p * Math.PI * 0.6;
      this.sm.canSystem.group.position.set(0, 0, 0);

      const orbitScale = p < 0.2 ? p / 0.2 : (p > 0.85 ? (1 - p) / 0.15 : 1);
      this.sm.orbitGroup.scale.set(orbitScale, orbitScale, orbitScale);

      this.sm.heroWatermelonLeft.position.x = -4.5;
      this.sm.heroWatermelonRight.position.x = 4.5;
      this.sm.limeCluster.position.x = -4.5;
      this.sm.heroLimeSlice.position.set(4.5, -0.65, 0.55);
      if (this.sm.heroLimeFloorSlice) {
        this.sm.heroLimeFloorSlice.position.set(-5, -1.18, 1.05);
      }
      if (this.sm.heroJelly1) {
        this.sm.heroJelly1.scale.set(0.001, 0.001, 0.001);
        this.sm.heroJelly1.position.set(-4.5, -1.2, 1.32);
      }
      if (this.sm.heroJelly2) {
        this.sm.heroJelly2.scale.set(0.001, 0.001, 0.001);
        this.sm.heroJelly2.position.set(4.5, -1.2, 1.08);
      }
    } else if (progress >= 0.74 && progress < 0.85) {
      // SECTION 5: NUTRITIONAL IMPACT (VIBRANT RED SCREEN) — matching frame_75/85.jpg
      const p = (progress - 0.74) / 0.11;
      this.hideConnectors();
      this.sm.orbitGroup.scale.set(0.001, 0.001, 0.001);

      // Can is on the left, tilted — matching frame_75.jpg half-screen split
      this.sm.canSystem.group.position.set(-1.4, -0.08, 0.4);
      this.sm.canSystem.group.rotation.set(0.15, 0.6 + p * 0.25, -0.12);

      if (this.sm.heroJelly1) {
        this.sm.heroJelly1.scale.set(0.001, 0.001, 0.001);
      }
      if (this.sm.heroJelly2) {
        this.sm.heroJelly2.scale.set(0.001, 0.001, 0.001);
      }

      const iceScale = Math.min(1, p * 2.5);
      this.sm.iceCubesGroup.scale.set(iceScale, iceScale, iceScale);

      if (this.counterCal) {
        const calVal = Math.round(68 * Math.min(1, p * 1.35));
        this.counterCal.textContent = calVal;
      }
    } else {
      // SECTION 6: zears Gaming SHOWCASE (CLEAN STUDIO COVE — ZERO CLASHING)
      const p = (progress - 0.85) / 0.15;
      this.hideConnectors();
      this.sm.orbitGroup.scale.set(0.001, 0.001, 0.001);
      this.sm.iceCubesGroup.scale.set(0.001, 0.001, 0.001);

      this.sm.canSystem.updateSplit(0);

      // On desktop, can stands cleanly on the left half; card is on the right
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        this.sm.canSystem.group.position.set(0, 0.65, 0);
      } else {
        this.sm.canSystem.group.position.set(-1.35, 0, 0.2);
      }
      // Front label proudly faces forward
      this.sm.canSystem.group.rotation.set(0, Math.PI + p * 0.2, 0);

      // Left fruits stand neatly beside the can on the left
      this.sm.heroWatermelonLeft.position.set(-2.2, -0.42, 0.35);
      this.sm.limeCluster.position.set(-1.45, -0.92, 0.65);

      if (this.sm.heroJelly1) {
        // Glistening crystal ice accent sitting comfortably beside the left lime cluster
        const s = Math.min(1, p * 2.2);
        this.sm.heroJelly1.scale.set(s, s, s);
        this.sm.heroJelly1.position.set(-1.08, -1.18 + Math.sin(time * 2.0) * 0.012, 1.15);
        this.sm.heroJelly1.rotation.set(0.12, 0.55 + time * 0.05, 0.08);
      }
      if (this.sm.heroJelly2) {
        // Right side completely clear of all fruits/cubes so NO collision or overlap with zears Gaming card!
        this.sm.heroJelly2.scale.set(0.001, 0.001, 0.001);
        this.sm.heroJelly2.position.set(5, -1.2, 1.08);
      }

      // Right fruits cleared away so they NEVER collide or overlap with the zears Gaming card!
      this.sm.heroWatermelonRight.position.set(5, -0.22, 0.05);
      this.sm.heroLimeSlice.position.set(5, -0.65, 0.55);
      if (this.sm.heroLimeFloorSlice) {
        this.sm.heroLimeFloorSlice.position.set(5, -1.20, 1.35);
      }
    }
  }

  animateBackground(progress) {
    if (!this.appBg) return;

    if (progress < 0.58) {
      // Warm tactile studio cyclorama (rich champagne-cream studio cove, never pale washed-out white)
      this.appBg.style.background = 'radial-gradient(circle at 50% 35%, #e8e3d5 0%, #d5cdbd 55%, #bab19e 100%)';
      document.body.classList.remove('theme-red', 'theme-green', 'theme-outro');
    } else if (progress >= 0.58 && progress < 0.74) {
      // Rich, juicy emerald forest atmosphere
      this.appBg.style.background = 'radial-gradient(circle at 50% 50%, #1e6b37 0%, #082813 100%)';
      document.body.classList.add('theme-green');
      document.body.classList.remove('theme-red', 'theme-outro');
    } else if (progress >= 0.74 && progress < 0.85) {
      // Intense, saturated, vibrant ruby watermelon red (ONLY during Section 5 Nutrition)
      this.appBg.style.background = 'radial-gradient(circle at 50% 45%, #e01e37 0%, #990017 100%)';
      document.body.classList.add('theme-red');
      document.body.classList.remove('theme-green', 'theme-outro');
    } else {
      // Warm luxury studio cyclorama for zears Gaming Showcase (NEVER RED!)
      this.appBg.style.background = 'radial-gradient(circle at 50% 35%, #e8e3d5 0%, #d5cdbd 55%, #bab19e 100%)';
      document.body.classList.add('theme-outro');
      document.body.classList.remove('theme-red', 'theme-green');
    }
  }

  updateConnectors(p) {
    if (!this.svgContainer) return;
    this.svgContainer.style.opacity = '1';

    const bandPoints = this.sm.canSystem.getBandWorldPoints();

    const screenPoints = bandPoints.map(v => {
      const clone = v.clone();
      clone.project(this.sm.camera);
      return {
        x: (clone.x * 0.5 + 0.5) * window.innerWidth,
        y: (-clone.y * 0.5 + 0.5) * window.innerHeight
      };
    });

    const targets = [46, 46, 8];

    for (let i = 0; i < 3; i++) {
      const pt = screenPoints[i];
      const label = this.labels[i];
      const line = this.lines[i];
      const dot = this.dots[i];
      const counter = this.counters[i];

      if (!label || !line) continue;

      const rect = label.getBoundingClientRect();
      const targetX = rect.left;
      const targetY = rect.top + rect.height * 0.5;

      // Draw crisp elbow connector line
      const elbowX = pt.x + (targetX - pt.x) * 0.35;
      const d = `M ${pt.x} ${pt.y} L ${elbowX} ${pt.y} L ${elbowX} ${targetY} L ${targetX} ${targetY}`;
      line.setAttribute('d', d);

      if (dot) {
        dot.setAttribute('cx', pt.x);
        dot.setAttribute('cy', pt.y);
      }

      // Staggered fade in (100ms apart, top to bottom)
      const threshold = 0.15 + i * 0.12;
      const labelAlpha = Math.min(1, Math.max(0, (p - threshold) / 0.2));
      label.style.opacity = labelAlpha.toString();
      label.style.transform = `translateX(${(1 - labelAlpha) * 20}px)`;
      line.style.opacity = (labelAlpha * 0.9).toString();
      if (dot) dot.style.opacity = (labelAlpha * 0.95).toString();

      // Count up numbers with scroll
      if (counter) {
        const val = Math.round(targets[i] * Math.min(1, Math.max(0, p * 1.2)));
        counter.textContent = `${val}%`;
      }
    }
  }

  hideConnectors() {
    if (this.svgContainer) {
      this.svgContainer.style.opacity = '0';
    }
    this.labels.forEach(l => {
      if (l) l.style.opacity = '0';
    });
  }
}
