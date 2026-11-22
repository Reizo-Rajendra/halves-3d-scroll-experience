import * as THREE from 'three';

/**
 * Ultra-Photorealistic 2048x1024 Textures for HALVES
 * 
 * UV Layout for CylinderGeometry:
 * In Three.js CylinderGeometry, with can.rotation.y = Math.PI,
 * the center of the front-facing camera view corresponds to u = 0.5 (x = 1024).
 * The back of the can corresponds to u = 0.0 and u = 1.0 (x = 0 and x = 2048).
 */

// 1. Can Body Label Texture (Front centered at x = 1024, Back centered at x = 0 / 2048)
export function createCanLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep rich emerald lacquer green background with vertical brushed luster
  const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  bgGrad.addColorStop(0.00, '#061c11');
  bgGrad.addColorStop(0.20, '#103d25');
  bgGrad.addColorStop(0.35, '#092918');
  bgGrad.addColorStop(0.50, '#134729');
  bgGrad.addColorStop(0.65, '#092918');
  bgGrad.addColorStop(0.80, '#103d25');
  bgGrad.addColorStop(1.00, '#061c11');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Micro-fine metallic brush lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  for (let i = 0; i < canvas.height; i += 3) {
    ctx.fillRect(0, i, canvas.width, 1);
  }

  // =========================================================================
  // FRONT LABEL (Centered at x = 1536, with offset.x = 0.75 so neither label touches the texture seam!)
  // =========================================================================
  const frontX = 1536;

  // Split Fruit Emblem (Watermelon on Left, Lime on Right)
  const emblemY = 370;
  const emblemRadius = 150;

  // Outer ambient shadow behind emblem for depth
  ctx.save();
  ctx.beginPath();
  ctx.arc(frontX, emblemY + 6, emblemRadius + 8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();
  ctx.restore();

  // Left Half: Watermelon
  ctx.save();
  ctx.beginPath();
  ctx.arc(frontX, emblemY, emblemRadius, Math.PI * 0.5, Math.PI * 1.5, false);
  ctx.closePath();
  ctx.fillStyle = '#1b5e20'; // dark green outer rind
  ctx.fill();

  ctx.beginPath();
  ctx.arc(frontX, emblemY, emblemRadius - 12, Math.PI * 0.5, Math.PI * 1.5, false);
  ctx.closePath();
  ctx.fillStyle = '#e8f5e9'; // crisp pale white-green inner rind
  ctx.fill();

  ctx.beginPath();
  ctx.arc(frontX, emblemY, emblemRadius - 22, Math.PI * 0.5, Math.PI * 1.5, false);
  ctx.closePath();
  ctx.fillStyle = '#e01e37'; // rich ruby red flesh
  ctx.fill();

  // Watermelon black glossy seeds
  const seeds = [
    { x: -55, y: -50, rot: -0.35 },
    { x: -75, y: 12, rot: 0.1 },
    { x: -40, y: 65, rot: 0.45 },
    { x: -35, y: -8, rot: -0.05 },
    { x: -70, y: -25, rot: -0.2 }
  ];
  seeds.forEach(s => {
    ctx.save();
    ctx.translate(frontX + s.x, emblemY + s.y);
    ctx.rotate(s.rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a0c';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-2, -4, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();

  // Right Half: Lime
  ctx.save();
  ctx.beginPath();
  ctx.arc(frontX, emblemY, emblemRadius, -Math.PI * 0.5, Math.PI * 0.5, false);
  ctx.closePath();
  ctx.fillStyle = '#1b5e20'; // dark lime peel
  ctx.fill();

  ctx.beginPath();
  ctx.arc(frontX, emblemY, emblemRadius - 12, -Math.PI * 0.5, Math.PI * 0.5, false);
  ctx.closePath();
  ctx.fillStyle = '#e8f5e9'; // crisp pale pith
  ctx.fill();

  ctx.beginPath();
  ctx.arc(frontX, emblemY, emblemRadius - 22, -Math.PI * 0.5, Math.PI * 0.5, false);
  ctx.closePath();
  ctx.fillStyle = '#76c810'; // electric vivid lime flesh
  ctx.fill();

  // Radial segments
  for (let i = -2; i <= 2; i++) {
    const angle = (i * 32) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(frontX + 6, emblemY);
    ctx.lineTo(frontX + Math.cos(angle) * (emblemRadius - 26), emblemY + Math.sin(angle) * (emblemRadius - 26));
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#e8f5e9';
    ctx.stroke();
  }
  ctx.restore();

  // Crisp dividing line between halves
  ctx.beginPath();
  ctx.moveTo(frontX, emblemY - emblemRadius - 6);
  ctx.lineTo(frontX, emblemY + emblemRadius + 6);
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // Brand Name "HALVES"
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '900 116px "Inter", "Arial Black", sans-serif';
  ctx.letterSpacing = '14px';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.fillText('HALVES', frontX, 610);
  ctx.shadowColor = 'transparent';

  // Subtitle
  ctx.font = '800 28px "Inter", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = '#b7e4c7';
  ctx.fillText('SPARKLING WATERMELON LIME', frontX, 665);

  // Tagline & Volume Info
  ctx.font = '700 20px "Inter", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('THREE INGREDIENTS • NOTHING ADDED', frontX, 720);

  ctx.font = '800 22px "Inter", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillStyle = '#f8f9fa';
  ctx.fillText('330 ML  •  11.2 FL OZ', frontX, 850);

  // Top rim accent band
  ctx.fillStyle = '#e01e37';
  ctx.fillRect(frontX - 250, 155, 500, 8);
  ctx.font = '800 16px "Inter", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('COLD PRESSED CRAFT SODA', frontX, 135);

  // =========================================================================
  // BACK LABEL (Centered at x = 0 / 2048, u = 0.0 / 1.0 — REVERSE SIDE)
  // =========================================================================
  // Draw nutrition card centered around x = 0 (and wrap to x = 2048)
  const drawBackCard = (backX) => {
    ctx.fillStyle = '#ffffff';
    ctx.roundRect ? ctx.roundRect(backX - 250, 180, 500, 590, 16) : ctx.fillRect(backX - 250, 180, 500, 590);
    ctx.fill();

    ctx.fillStyle = '#111827';
    ctx.textAlign = 'left';
    ctx.font = '900 38px "Inter", sans-serif';
    ctx.fillText('Nutrition Facts', backX - 215, 245);

    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillStyle = '#4b5563';
    ctx.fillText('1 can (330ml) per serving', backX - 215, 278);

    ctx.fillStyle = '#111827';
    ctx.fillRect(backX - 215, 295, 430, 4);

    ctx.font = '800 22px "Inter", sans-serif';
    ctx.fillText('Calories per can', backX - 215, 332);
    ctx.textAlign = 'right';
    ctx.font = '900 52px "Inter", sans-serif';
    ctx.fillText('68', backX + 215, 338);

    ctx.fillStyle = '#111827';
    ctx.fillRect(backX - 215, 355, 430, 2);

    ctx.textAlign = 'left';
    ctx.font = '800 17px "Inter", sans-serif';
    ctx.fillStyle = '#111827';
    ctx.fillText('Ingredients breakdown:', backX - 215, 390);

    const facts = [
      { label: 'Cold Pressed Watermelon Juice', val: '46%' },
      { label: 'Cold Pressed Key Lime Juice', val: '46%' },
      { label: 'Organic Blue Agave Nectar', val: '8%' },
      { label: 'Total Sugars (From Real Fruit)', val: '14g' },
      { label: 'Added Cane Sugars', val: '0g' },
      { label: 'Vitamin C (Naturally Occurring)', val: '28mg' }
    ];

    let factY = 426;
    facts.forEach(f => {
      ctx.font = '500 15px "Inter", sans-serif';
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'left';
      ctx.fillText(f.label, backX - 215, factY);

      ctx.font = '800 15px "Inter", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(f.val, backX + 215, factY);

      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(backX - 215, factY + 8, 430, 1);
      factY += 32;
    });

    const barcodeY = 655;
    ctx.fillStyle = '#111827';
    for (let b = backX - 170; b < backX + 170; b += 6) {
      const barW = (b % 4 === 0) ? 4 : 2;
      ctx.fillRect(b, barcodeY, barW, 60);
    }

    ctx.textAlign = 'center';
    ctx.font = '700 14px monospace';
    ctx.fillStyle = '#374151';
    ctx.fillText('0 793573 841920', backX, barcodeY + 82);
  };

  // Draw nutrition card centered at x = 512 (safely inside canvas, 262px from borders - ZERO CROPPING!)
  drawBackCard(512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  // Offset by 0.75 so front (x=1536) maps to u=0.50 and back (x=512) maps to u=0.00
  texture.offset.x = 0.75;
  texture.anisotropy = 16;
  return texture;
}

// 2. Condensation / Droplets Normal & Bump Map
export function createCondensationTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 2800; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() < 0.88 ? Math.random() * 3.5 + 1.2 : Math.random() * 8 + 3.5;

    const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, 0, x, y, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.65, '#cccccc');
    grad.addColorStop(1, '#808080');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let d = 0; d < 45; d++) {
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * (canvas.height * 0.7);
    const dropLen = Math.random() * 80 + 30;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(startX + 3, startY + dropLen * 0.4, startX - 3, startY + dropLen * 0.7, startX, startY + dropLen);
    ctx.lineWidth = Math.random() * 3 + 2;
    ctx.strokeStyle = '#d0d0d0';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(startX, startY + dropLen, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#efefef';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = 8;
  return texture;
}

// 3. Sliced Lime Disc Cap Texture (High-Definition Photorealistic Citrus Cross Section)
export function createLimeDiscTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  const cx = 512;
  const cy = 512;
  const radius = 480;

  // 1. Outer peel (Natural waxy dark green citrus rind with cellular mottling)
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  const peelGrad = ctx.createRadialGradient(cx, cy, radius - 26, cx, cy, radius);
  peelGrad.addColorStop(0, '#2b6319');
  peelGrad.addColorStop(0.7, '#1d4810');
  peelGrad.addColorStop(1, '#14380a');
  ctx.fillStyle = peelGrad;
  ctx.fill();

  // 2. Inner Pith (Albedo layer: soft natural gradient from peel to pulp)
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 18, 0, Math.PI * 2);
  const pithGrad = ctx.createRadialGradient(cx, cy, radius - 55, cx, cy, radius - 18);
  pithGrad.addColorStop(0, '#b8e35f');
  pithGrad.addColorStop(0.35, '#d9f2a7');
  pithGrad.addColorStop(0.85, '#edf7da');
  pithGrad.addColorStop(1, '#c5e88e');
  ctx.fillStyle = pithGrad;
  ctx.fill();

  // 3. Pulp Base (Juicy translucent chartreuse bed)
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 48, 0, Math.PI * 2);
  const pulpBase = ctx.createRadialGradient(cx, cy, 30, cx, cy, radius - 48);
  pulpBase.addColorStop(0, '#aae23b');
  pulpBase.addColorStop(0.65, '#82c91e');
  pulpBase.addColorStop(1, '#65a810');
  ctx.fillStyle = pulpBase;
  ctx.fill();

  // 4. Ten Natural Carpel Segments with thousands of layered juice vesicles
  const segments = 10;
  for (let s = 0; s < segments; s++) {
    const startAngle = (s * 360 / segments) * Math.PI / 180 + 0.025;
    const endAngle = ((s + 1) * 360 / segments) * Math.PI / 180 - 0.025;
    const midAngle = (startAngle + endAngle) / 2;

    // Segment base glow
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius - 52, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = (s % 2 === 0) ? '#7fc71c' : '#88d222';
    ctx.fill();

    // 220+ Teardrop Translucent Juice Vesicles (pulp sacs) per segment
    for (let v = 0; v < 220; v++) {
      const dist = Math.pow(Math.random(), 0.85) * (radius - 105) + 42;
      const spread = (Math.random() - 0.5) * (endAngle - startAngle) * 0.88;
      const angle = midAngle + spread;
      const vx = cx + Math.cos(angle) * dist;
      const vy = cy + Math.sin(angle) * dist;

      const vLen = Math.random() * 9 + 4.5;
      const vWidth = Math.random() * 4 + 2;

      ctx.save();
      ctx.translate(vx, vy);
      ctx.rotate(angle + (Math.random() - 0.5) * 0.4);

      // Vesicle body
      ctx.beginPath();
      ctx.ellipse(0, 0, vWidth, vLen, 0, 0, Math.PI * 2);
      const isBright = Math.random() < 0.65;
      ctx.fillStyle = isBright ? 'rgba(185, 245, 65, 0.75)' : 'rgba(105, 175, 20, 0.65)';
      ctx.fill();

      // Specular glistening wet highlight on top of vesicle
      if (Math.random() < 0.45) {
        ctx.beginPath();
        ctx.arc(-vWidth * 0.25, -vLen * 0.35, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // 5. Delicate, ultra-fine carpel membrane walls (translucent, NOT thick black/white strokes!)
  for (let s = 0; s < segments; s++) {
    const angle = (s * 360 / segments) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * (radius - 45), cy + Math.sin(angle) * (radius - 45));
    ctx.strokeStyle = 'rgba(240, 252, 225, 0.55)';
    ctx.lineWidth = 3.0;
    ctx.stroke();

    // Subtle dark shadow line along membrane for 3D depth
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle + 0.005) * (radius - 48), cy + Math.sin(angle + 0.005) * (radius - 48));
    ctx.strokeStyle = 'rgba(45, 80, 15, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // 6. Natural soft central core / columella
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 38);
  coreGrad.addColorStop(0, '#f2fae4');
  coreGrad.addColorStop(0.5, '#e4f5cc');
  coreGrad.addColorStop(1, 'rgba(165, 218, 60, 0)');
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.fillStyle = coreGrad;
  ctx.fill();

  // Subtle natural radial fibers from core
  for (let f = 0; f < 32; f++) {
    const fAngle = (f * Math.PI * 2) / 32;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(fAngle) * 32, cy + Math.sin(fAngle) * 32);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  return texture;
}

// 4. Sliced Watermelon Wedge Texture (Photorealistic Granular Crystalline Ruby Flesh)
export function createWatermelonWedgeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base juicy crimson red
  ctx.fillStyle = '#dc143c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Deep ruby red gradient across pulp
  const pulpGrad = ctx.createRadialGradient(canvas.width * 0.35, canvas.height * 0.35, 50, canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.7);
  pulpGrad.addColorStop(0, '#f02d4b');
  pulpGrad.addColorStop(0.4, '#e01638');
  pulpGrad.addColorStop(0.85, '#c20826');
  pulpGrad.addColorStop(1, '#9e0018');
  ctx.fillStyle = pulpGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 12,000+ Crystalline Watermelon Sugar Cells (giving real granular watermelon sparkle)
  for (let p = 0; p < 9000; p++) {
    const px = Math.random() * canvas.width;
    const py = Math.random() * canvas.height;
    const pr = Math.random() * 2.8 + 0.8;

    const r = Math.random();
    if (r < 0.4) {
      ctx.fillStyle = 'rgba(255, 90, 115, 0.45)'; // bright crystalline facet
    } else if (r < 0.75) {
      ctx.fillStyle = 'rgba(165, 0, 25, 0.4)'; // deep juice shadow
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.32)'; // glistening cell reflection
    }

    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Natural Rind Transition on outer curve (flesh -> coral pink -> pale pith -> dark rind)
  const rindGrad = ctx.createLinearGradient(canvas.width - 200, 0, canvas.width, 0);
  rindGrad.addColorStop(0.00, 'rgba(224, 22, 56, 0)');
  rindGrad.addColorStop(0.35, '#f78598'); // soft coral pink transition
  rindGrad.addColorStop(0.55, '#fbfce8'); // crisp creamy white pith
  rindGrad.addColorStop(0.72, '#98d49a'); // fresh jade green
  rindGrad.addColorStop(0.88, '#266938'); // deep rind green
  rindGrad.addColorStop(1.00, '#10371a'); // dark outer striped edge
  ctx.fillStyle = rindGrad;
  ctx.fillRect(canvas.width - 200, 0, 200, canvas.height);

  // Photorealistic Embedded Seeds (realistic teardrop shape with seed coat rim and specular shine)
  const seedCoords = [
    { x: 220, y: 250, rot: 0.6, s: 1.0 },
    { x: 380, y: 190, rot: -0.4, s: 0.9 },
    { x: 450, y: 380, rot: 0.2, s: 1.1 },
    { x: 280, y: 460, rot: -0.7, s: 0.95 },
    { x: 580, y: 280, rot: 0.8, s: 1.05 },
    { x: 340, y: 640, rot: -0.3, s: 0.85 },
    { x: 510, y: 550, rot: 0.4, s: 1.0 },
    { x: 640, y: 460, rot: -0.6, s: 1.1 },
    { x: 210, y: 620, rot: 0.1, s: 0.9 },
    { x: 430, y: 720, rot: -0.5, s: 1.0 },
    { x: 620, y: 670, rot: 0.3, s: 0.95 }
  ];

  seedCoords.forEach(sc => {
    ctx.save();
    ctx.translate(sc.x, sc.y);
    ctx.rotate(sc.rot);
    ctx.scale(sc.s, sc.s);

    // Natural pulp indentation pocket (dark wet cavity around seed)
    ctx.beginPath();
    ctx.ellipse(1, 2, 13, 23, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(110, 0, 15, 0.55)';
    ctx.fill();

    // Seed body (Rich espresso dark brown/black)
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 20, 0, 0, Math.PI * 2);
    const sGrad = ctx.createLinearGradient(-10, -20, 10, 20);
    sGrad.addColorStop(0, '#2d1c14');
    sGrad.addColorStop(0.4, '#140c09');
    sGrad.addColorStop(1, '#0a0504');
    ctx.fillStyle = sGrad;
    ctx.fill();

    // Raised seed rim
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#42281d';
    ctx.stroke();

    // Specular gloss reflection along curved seed ridge
    ctx.beginPath();
    ctx.ellipse(-3, -5, 2.5, 9, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fill();

    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 16;
  return texture;
}

// 5. Watermelon Outer Curved Striped Skin Texture (Authentic Crimson Sweet Pattern)
export function createWatermelonRindTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep dark forest green base
  ctx.fillStyle = '#11331c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Micro waxy mottling
  for (let m = 0; m < 1500; m++) {
    const mx = Math.random() * canvas.width;
    const my = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(28, 80, 42, 0.3)' : 'rgba(8, 28, 14, 0.35)';
    ctx.beginPath();
    ctx.arc(mx, my, Math.random() * 8 + 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wavy, feathered lighter green organic stripes
  for (let s = 20; s < canvas.width; s += 85) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(s, 0);

    for (let y = 0; y <= canvas.height; y += 25) {
      const wobble = Math.sin(y * 0.04 + s) * 22 + Math.cos(y * 0.08) * 12;
      ctx.lineTo(s + wobble, y);
    }

    ctx.lineWidth = 36;
    ctx.strokeStyle = '#327a45';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Inner bright stripe core
    ctx.lineWidth = 18;
    ctx.strokeStyle = '#5bb872';
    ctx.stroke();

    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

// 6. Aluminum Brushed Can Lid and Bottom
export function createBrushedMetalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const cx = 256;
  const cy = 256;

  for (let r = 250; r > 0; r -= 2) {
    const shade = Math.floor(220 + Math.random() * 35);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgb(${shade}, ${shade}, ${shade})`;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(cx, cy - 40);
  ctx.fillStyle = 'rgba(80, 80, 80, 0.5)';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(-30, -50, 60, 100, 20) : ctx.fillRect(-30, -50, 60, 100);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 20, 16, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(40, 40, 40, 0.7)';
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 7. Photorealistic Whole Key Lime Skin Texture (Natural waxy citrus pores and mottling)
export function createLimeSkinTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base natural botanical deep lime green
  ctx.fillStyle = '#327018';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Organic micro-mottling (color variation from orchard ripeness)
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 80 + 30;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    const col = Math.random() < 0.5 ? 'rgba(68, 138, 30, 0.35)' : 'rgba(38, 86, 18, 0.4)';
    grad.addColorStop(0, col);
    grad.addColorStop(1, 'rgba(50, 112, 24, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Micro-pores (2800 tiny citrus oil cells)
  for (let p = 0; p < 2800; p++) {
    const px = Math.random() * canvas.width;
    const py = Math.random() * canvas.height;
    const pr = Math.random() * 2.2 + 0.8;
    ctx.fillStyle = 'rgba(24, 56, 12, 0.45)';
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();

    // Specular pore highlight
    ctx.fillStyle = 'rgba(120, 200, 60, 0.28)';
    ctx.beginPath();
    ctx.arc(px + 0.8, py + 0.8, pr * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stem pole halo (subtle lighter yellowish-green tint near top)
  const stemGrad = ctx.createRadialGradient(512, 120, 10, 512, 120, 220);
  stemGrad.addColorStop(0, 'rgba(145, 185, 45, 0.55)');
  stemGrad.addColorStop(1, 'rgba(50, 112, 24, 0)');
  ctx.fillStyle = stemGrad;
  ctx.beginPath();
  ctx.arc(512, 120, 220, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  return texture;
}

// 8. Whole Lime Peel Bump Map
export function createLimeBumpTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 2.5 + 0.9;
    ctx.fillStyle = Math.random() < 0.6 ? '#505050' : '#b0b0b0';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

