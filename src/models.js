import * as THREE from 'three';
import {
  createCanLabelTexture,
  createCondensationTexture,
  createLimeDiscTexture,
  createWatermelonWedgeTexture,
  createWatermelonRindTexture,
  createBrushedMetalTexture,
  createLimeSkinTexture,
  createLimeBumpTexture
} from './textures.js';

/**
 * Authentic 3D Models for HALVES (Frame-by-Frame match to TikTok video)
 * 1. 3-Band Slicing Aluminum Can with Front Label facing forward, silver chime rim and recessed lid
 * 2. Thick 3D Watermelon wedge with striped rind and embedded seeds
 * 3. Natural waxy key limes (matte citrus peel with pores and leaf)
 * 4. Cut lime slice on floor
 * 5. Architectural 3D "H A L V E S" background typography
 */

export class HalvesCanSystem {
  constructor() {
    this.group = new THREE.Group();
    this.bands = [];
    this.cutDiscs = [];
    this.clippingPlanes = [];

    this.canHeight = 2.4;
    this.canRadius = 0.65;
    this.cutY = 0.4; // cuts are at y = -0.4 and y = +0.4

    this.initTextures();
    this.initMaterials();
    this.buildCanBands();
    this.addPhysicalDroplets();

    // Default: Rotate can so FRONT label (HALVES logo) faces camera!
    this.group.rotation.y = Math.PI;
  }

  initTextures() {
    this.labelTexture = createCanLabelTexture();
    this.bumpTexture = createCondensationTexture();
    this.limeDiscTexture = createLimeDiscTexture();
    this.brushedTexture = createBrushedMetalTexture();
  }

  initMaterials() {
    // Premium cold aluminum lacquer with clearcoat
    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      map: this.labelTexture,
      bumpMap: this.bumpTexture,
      bumpScale: 0.035,
      roughness: 0.18,
      metalness: 0.75,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      clippingPlanes: [],
      clipShadows: true,
      side: THREE.DoubleSide
    });

    // Brushed metal for aluminum rim and recessed lid
    this.metalMaterial = new THREE.MeshStandardMaterial({
      map: this.brushedTexture,
      roughness: 0.25,
      metalness: 0.95,
      color: 0xf5f5f5
    });

    // Fruit slice interior discs (glistening pulp with citrus vesicles)
    this.discMaterial = new THREE.MeshPhysicalMaterial({
      map: this.limeDiscTexture,
      roughness: 0.25,
      metalness: 0.02,
      bumpMap: this.bumpTexture,
      bumpScale: 0.025,
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
      side: THREE.DoubleSide
    });
  }

  buildCanBands() {
    const canGeo = new THREE.CylinderGeometry(this.canRadius, this.canRadius, this.canHeight, 72, 32, true);
    
    // Top beveled silver rim and lid
    const lidGeo = new THREE.CylinderGeometry(this.canRadius * 0.95, this.canRadius, 0.09, 72);
    const bottomGeo = new THREE.CylinderGeometry(this.canRadius, this.canRadius * 0.93, 0.09, 72);

    for (let i = 0; i < 3; i++) {
      const bandGroup = new THREE.Group();
      bandGroup.name = `band_${i}`;

      const mat = this.bodyMaterial.clone();
      const planes = [];

      if (i === 0) {
        // Bottom band
        const pTop = new THREE.Plane(new THREE.Vector3(0, -1, 0), -this.cutY);
        planes.push(pTop);
        mat.clippingPlanes = planes;

        const disc = this.createCapDisc(-this.cutY, Math.PI / 2);
        bandGroup.add(disc);
        this.cutDiscs.push({ disc, basePos: new THREE.Vector3(0, -this.cutY, 0), bandIndex: 0 });

        const bRim = new THREE.Mesh(bottomGeo, this.metalMaterial);
        bRim.position.y = -this.canHeight / 2;
        bRim.castShadow = true;
        bandGroup.add(bRim);
      } else if (i === 1) {
        // Middle band
        const pBottom = new THREE.Plane(new THREE.Vector3(0, 1, 0), this.cutY);
        const pTop = new THREE.Plane(new THREE.Vector3(0, -1, 0), this.cutY);
        planes.push(pBottom, pTop);
        mat.clippingPlanes = planes;

        const discBottom = this.createCapDisc(-this.cutY, -Math.PI / 2);
        bandGroup.add(discBottom);
        this.cutDiscs.push({ disc: discBottom, basePos: new THREE.Vector3(0, -this.cutY, 0), bandIndex: 1 });

        const discTop = this.createCapDisc(this.cutY, Math.PI / 2);
        bandGroup.add(discTop);
        this.cutDiscs.push({ disc: discTop, basePos: new THREE.Vector3(0, this.cutY, 0), bandIndex: 1 });
      } else if (i === 2) {
        // Top band
        const pBottom = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.cutY);
        planes.push(pBottom);
        mat.clippingPlanes = planes;

        const disc = this.createCapDisc(this.cutY, -Math.PI / 2);
        bandGroup.add(disc);
        this.cutDiscs.push({ disc, basePos: new THREE.Vector3(0, this.cutY, 0), bandIndex: 2 });

        const tLid = new THREE.Mesh(lidGeo, this.metalMaterial);
        tLid.position.y = this.canHeight / 2;
        tLid.castShadow = true;
        bandGroup.add(tLid);
      }

      const mesh = new THREE.Mesh(canGeo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      bandGroup.add(mesh);

      this.group.add(bandGroup);
      this.bands.push({ group: bandGroup, material: mat, planes });
    }
  }

  createCapDisc(yPos, rotX) {
    const discGeo = new THREE.CircleGeometry(this.canRadius * 0.995, 64);
    const discMesh = new THREE.Mesh(discGeo, this.discMaterial);
    discMesh.rotation.x = rotX;
    discMesh.position.y = yPos;
    discMesh.receiveShadow = true;
    return discMesh;
  }

  addPhysicalDroplets() {
    // 3D physical water droplets (small, subtle, glistening)
    const dropGeo = new THREE.SphereGeometry(0.018, 8, 8);
    dropGeo.scale(1, 1.3, 0.6);

    const dropMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      roughness: 0.04,
      ior: 1.33,
      transparent: true,
      opacity: 0.92
    });

    const dropCountPerBand = 40;
    for (let i = 0; i < 3; i++) {
      const bandGroup = this.bands[i].group;
      const yMin = i === 0 ? -1.15 : (i === 1 ? -0.35 : 0.45);
      const yMax = i === 0 ? -0.45 : (i === 1 ? 0.35 : 1.15);

      for (let d = 0; d < dropCountPerBand; d++) {
        const angle = Math.random() * Math.PI * 2;
        const y = yMin + Math.random() * (yMax - yMin);
        const r = this.canRadius + 0.004;

        const drop = new THREE.Mesh(dropGeo, dropMat);
        drop.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
        drop.lookAt(0, y, 0);
        drop.rotation.y += Math.PI;
        const s = Math.random() * 0.7 + 0.5;
        drop.scale.set(s, s, s);
        bandGroup.add(drop);
      }
    }
  }

  updateSplit(p) {
    for (let i = 0; i < 3; i++) {
      const band = this.bands[i];
      const targetY = (i - 1) * 0.6 * p;
      const targetRotY = (i - 1) * 0.15 * p;

      band.group.position.y = targetY;
      band.group.rotation.y = targetRotY;

      if (i === 0) {
        band.planes[0].constant = targetY - this.cutY;
      } else if (i === 1) {
        band.planes[0].constant = this.cutY - targetY;
        band.planes[1].constant = targetY + this.cutY;
      } else if (i === 2) {
        band.planes[0].constant = -targetY - this.cutY;
      }
    }
  }

  getBandWorldPoints() {
    const points = [];
    for (let i = 0; i < 3; i++) {
      // Connect to the right side of the can in world space
      const v = new THREE.Vector3(this.canRadius, 0, 0);
      if (i === 0) v.y = -0.8;
      if (i === 1) v.y = 0.0;
      if (i === 2) v.y = 0.8;

      this.bands[i].group.localToWorld(v);
      points.push(v);
    }
    return points;
  }
}

/**
 * 3D Watermelon Slice (Wedge geometry with realistic striped rind and 3D seeds)
 */
export function createWatermelonModel() {
  const group = new THREE.Group();
  const radius = 1.35;
  const depth = 0.42;
  const angle = Math.PI / 3; // 60-degree wedge

  const textureFace = createWatermelonWedgeTexture();
  const textureRind = createWatermelonRindTexture();

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.arc(0, 0, radius, 0, angle, false);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: depth,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 4
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();

  const pulpMat = new THREE.MeshPhysicalMaterial({
    map: textureFace,
    roughness: 0.35,
    metalness: 0.02,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2
  });

  const rindMat = new THREE.MeshStandardMaterial({
    map: textureRind,
    roughness: 0.4,
    metalness: 0.04
  });

  const mesh = new THREE.Mesh(geo, [pulpMat, rindMat]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  // 3D shiny black seeds embedded in the flesh
  const seedGeo = new THREE.SphereGeometry(0.045, 12, 12);
  seedGeo.scale(0.7, 1.4, 0.4);
  const seedMat = new THREE.MeshStandardMaterial({ color: 0x08080c, roughness: 0.2, metalness: 0.25 });

  const seedPositions = [
    { x: -0.15, y: -0.1, z: depth / 2 + 0.015, rot: 0.3 },
    { x: 0.12, y: 0.25, z: depth / 2 + 0.015, rot: -0.4 },
    { x: 0.32, y: -0.05, z: depth / 2 + 0.015, rot: 0.2 },
    { x: -0.08, y: 0.18, z: depth / 2 + 0.015, rot: -0.1 },
    { x: 0.05, y: -0.22, z: depth / 2 + 0.015, rot: 0.5 }
  ];

  seedPositions.forEach(sp => {
    const sMesh = new THREE.Mesh(seedGeo, seedMat);
    sMesh.position.set(sp.x, sp.y, sp.z);
    sMesh.rotation.z = sp.rot;
    group.add(sMesh);

    const sMeshBack = new THREE.Mesh(seedGeo, seedMat);
    sMeshBack.position.set(sp.x, sp.y, -sp.z);
    sMeshBack.rotation.z = -sp.rot;
    group.add(sMeshBack);
  });

  return group;
}

/**
 * 3D Whole Lime (Organic citrus shape with pores, stem and leaf)
 */
export function createLimeModel() {
  const group = new THREE.Group();

  // Organic citrus shape: slightly tapered, naturally dimpled egg shape
  const sphereGeo = new THREE.SphereGeometry(0.48, 48, 48);
  const pos = sphereGeo.attributes.position;
  // Natural slight organic asymmetry
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const taper = 1.0 - y * 0.08;
    pos.setX(i, pos.getX(i) * taper);
    pos.setZ(i, pos.getZ(i) * taper);
  }
  sphereGeo.scale(0.96, 1.12, 0.96);
  sphereGeo.computeVertexNormals();

  const skinTex = createLimeSkinTexture();
  const bumpTex = createLimeBumpTexture();

  const limeMat = new THREE.MeshPhysicalMaterial({
    map: skinTex,
    bumpMap: bumpTex,
    bumpScale: 0.038,
    roughness: 0.42,
    metalness: 0.01,
    clearcoat: 0.38,
    clearcoatRoughness: 0.22,
    reflectivity: 0.5
  });

  const limeMesh = new THREE.Mesh(sphereGeo, limeMat);
  limeMesh.castShadow = true;
  limeMesh.receiveShadow = true;
  group.add(limeMesh);

  // Wooden stem button (dark organic calyx)
  const stemGeo = new THREE.CylinderGeometry(0.04, 0.065, 0.09, 16);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x223015, roughness: 0.9 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = 0.53;
  group.add(stem);

  // Fresh green citrus leaf
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.quadraticCurveTo(0.18, 0.22, 0.1, 0.5);
  leafShape.quadraticCurveTo(0, 0.56, -0.1, 0.5);
  leafShape.quadraticCurveTo(-0.18, 0.22, 0, 0);

  const leafGeo = new THREE.ShapeGeometry(leafShape);
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x255d40,
    roughness: 0.35,
    side: THREE.DoubleSide
  });
  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.position.set(0.04, 0.55, 0.02);
  leaf.rotation.set(0.35, 0.2, -0.65);
  leaf.scale.set(0.78, 0.78, 0.78);
  leaf.castShadow = true;
  group.add(leaf);

  return group;
}

/**
 * 3D Cut Lime Slice / Wheel
 */
export function createLimeSliceModel() {
  const group = new THREE.Group();
  const radius = 0.54;
  const thickness = 0.10;

  const geo = new THREE.CylinderGeometry(radius, radius, thickness, 64);
  const discTex = createLimeDiscTexture();
  const skinTex = createLimeSkinTexture();
  const bumpTex = createLimeBumpTexture();

  // Translucent, juicy citrus cross-section face
  const discMat = new THREE.MeshPhysicalMaterial({
    map: discTex,
    bumpMap: bumpTex,
    bumpScale: 0.022,
    roughness: 0.20,
    metalness: 0.01,
    clearcoat: 0.90,
    clearcoatRoughness: 0.12,
    transmission: 0.12,
    ior: 1.38
  });

  // Waxy botanical lime peel on the outer rim
  const rindMat = new THREE.MeshPhysicalMaterial({
    map: skinTex,
    bumpMap: bumpTex,
    bumpScale: 0.035,
    roughness: 0.45,
    metalness: 0.02,
    clearcoat: 0.35,
    clearcoatRoughness: 0.25
  });

  const mesh = new THREE.Mesh(geo, [rindMat, discMat, discMat]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  return group;
}

/**
 * 3D Crystal Ice Cube
 */
export function createIceCubeModel(size = 0.45) {
  const geo = new THREE.BoxGeometry(size, size, size, 4, 4, 4);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);
    const jitter = 0.025;
    pos.setXYZ(
      i,
      vx + (Math.random() - 0.5) * jitter,
      vy + (Math.random() - 0.5) * jitter,
      vz + (Math.random() - 0.5) * jitter
    );
  }
  geo.computeVertexNormals();

  const iceMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.95,
    opacity: 1,
    transparent: true,
    roughness: 0.04,
    ior: 1.33,
    thickness: 1.0,
    specularIntensity: 1.0,
    specularColor: 0xffffff
  });

  const mesh = new THREE.Mesh(geo, iceMat);
  mesh.castShadow = true;
  return mesh;
}

/**
 * 3D Architectural Background Typography "H A L V E S"
 * Clean geometric beveled letters standing softly in studio background
 */
export function create3DBackgroundTypography() {
  const group = new THREE.Group();

  const letterMat = new THREE.MeshStandardMaterial({
    color: 0xc8c2b2, // warm architectural sculpted stone with distinct contrast
    roughness: 0.38,
    metalness: 0.05
  });

  const extrudeSettings = {
    depth: 0.28,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.035,
    bevelSegments: 4
  };

  const createExtrudedLetter = (shape) => {
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    const mesh = new THREE.Mesh(geo, letterMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  // H
  const hShape = new THREE.Shape();
  hShape.moveTo(-0.35, -0.65);
  hShape.lineTo(-0.15, -0.65);
  hShape.lineTo(-0.15, -0.12);
  hShape.lineTo(0.15, -0.12);
  hShape.lineTo(0.15, -0.65);
  hShape.lineTo(0.35, -0.65);
  hShape.lineTo(0.35, 0.65);
  hShape.lineTo(0.15, 0.65);
  hShape.lineTo(0.15, 0.12);
  hShape.lineTo(-0.15, 0.12);
  hShape.lineTo(-0.15, 0.65);
  hShape.lineTo(-0.35, 0.65);
  hShape.closePath();
  const hMesh = createExtrudedLetter(hShape);
  hMesh.position.x = -3.0;
  group.add(hMesh);

  // A
  const aShape = new THREE.Shape();
  aShape.moveTo(-0.4, -0.65);
  aShape.lineTo(-0.15, 0.65);
  aShape.lineTo(0.15, 0.65);
  aShape.lineTo(0.4, -0.65);
  aShape.lineTo(0.18, -0.65);
  aShape.lineTo(0.1, -0.2);
  aShape.lineTo(-0.1, -0.2);
  aShape.lineTo(-0.18, -0.65);
  aShape.closePath();

  const aHole = new THREE.Path();
  aHole.moveTo(-0.06, 0.0);
  aHole.lineTo(0.06, 0.0);
  aHole.lineTo(0, 0.35);
  aHole.closePath();
  aShape.holes.push(aHole);

  const aMesh = createExtrudedLetter(aShape);
  aMesh.position.x = -1.8;
  group.add(aMesh);

  // L
  const lShape = new THREE.Shape();
  lShape.moveTo(-0.3, -0.65);
  lShape.lineTo(0.35, -0.65);
  lShape.lineTo(0.35, -0.42);
  lShape.lineTo(-0.1, -0.42);
  lShape.lineTo(-0.1, 0.65);
  lShape.lineTo(-0.3, 0.65);
  lShape.closePath();
  const lMesh = createExtrudedLetter(lShape);
  lMesh.position.x = -0.6;
  group.add(lMesh);

  // V
  const vShape = new THREE.Shape();
  vShape.moveTo(-0.4, 0.65);
  vShape.lineTo(-0.18, 0.65);
  vShape.lineTo(0, -0.35);
  vShape.lineTo(0.18, 0.65);
  vShape.lineTo(0.4, 0.65);
  vShape.lineTo(0.12, -0.65);
  vShape.lineTo(-0.12, -0.65);
  vShape.closePath();
  const vMesh = createExtrudedLetter(vShape);
  vMesh.position.x = 0.6;
  group.add(vMesh);

  // E
  const eShape = new THREE.Shape();
  eShape.moveTo(-0.3, -0.65);
  eShape.lineTo(0.35, -0.65);
  eShape.lineTo(0.35, -0.45);
  eShape.lineTo(-0.1, -0.45);
  eShape.lineTo(-0.1, -0.1);
  eShape.lineTo(0.28, -0.1);
  eShape.lineTo(0.28, 0.1);
  eShape.lineTo(-0.1, 0.1);
  eShape.lineTo(-0.1, 0.45);
  eShape.lineTo(0.35, 0.45);
  eShape.lineTo(0.35, 0.65);
  eShape.lineTo(-0.3, 0.65);
  eShape.closePath();
  const eMesh = createExtrudedLetter(eShape);
  eMesh.position.x = 1.8;
  group.add(eMesh);

  // S
  const sShape = new THREE.Shape();
  sShape.moveTo(-0.35, -0.4);
  sShape.lineTo(-0.15, -0.4);
  sShape.quadraticCurveTo(-0.15, -0.45, 0, -0.45);
  sShape.quadraticCurveTo(0.15, -0.45, 0.15, -0.3);
  sShape.quadraticCurveTo(0.15, -0.15, -0.1, 0.0);
  sShape.quadraticCurveTo(-0.35, 0.15, -0.35, 0.4);
  sShape.quadraticCurveTo(-0.35, 0.65, 0, 0.65);
  sShape.quadraticCurveTo(0.35, 0.65, 0.35, 0.35);
  sShape.lineTo(0.15, 0.35);
  sShape.quadraticCurveTo(0.15, 0.45, 0, 0.45);
  sShape.quadraticCurveTo(-0.15, 0.45, -0.15, 0.35);
  sShape.quadraticCurveTo(-0.15, 0.2, 0.1, 0.05);
  sShape.quadraticCurveTo(0.35, -0.1, 0.35, -0.35);
  sShape.quadraticCurveTo(0.35, -0.65, 0, -0.65);
  sShape.quadraticCurveTo(-0.35, -0.65, -0.35, -0.4);
  sShape.closePath();
  const sMesh = createExtrudedLetter(sShape);
  sMesh.position.x = 3.0;
  group.add(sMesh);

  group.position.set(0, 0.25, -2.6);
  return group;
}
