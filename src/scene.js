import * as THREE from 'three';
import {
  HalvesCanSystem,
  createWatermelonModel,
  createLimeModel,
  createLimeSliceModel,
  createIceCubeModel,
  create3DBackgroundTypography
} from './models.js';

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.initScene();
    this.initLights();
    this.initEnvironment();
    this.initObjects();
    this.initEvents();
  }

  initScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 5.8);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.localClippingEnabled = true;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.container.appendChild(this.renderer.domElement);
  }

  initLights() {
    this.ambientLight = new THREE.AmbientLight(0xfffbf5, 0.74);
    this.scene.add(this.ambientLight);

    // Key studio light (casting soft product shadows)
    this.keyLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    this.keyLight.position.set(3.8, 5.8, 4.6);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 20;
    this.keyLight.shadow.camera.left = -5;
    this.keyLight.shadow.camera.right = 5;
    this.keyLight.shadow.camera.top = 5;
    this.keyLight.shadow.camera.bottom = -5;
    this.keyLight.shadow.bias = -0.00015;
    this.keyLight.shadow.radius = 4.8;
    this.scene.add(this.keyLight);

    // Left fill light (cool crisp rim)
    this.fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.15);
    this.fillLight.position.set(-5, 2.5, 3.5);
    this.scene.add(this.fillLight);

    // Right warm rim light (accents fruit gloss and can curvature)
    this.rimLight = new THREE.DirectionalLight(0xffeedd, 1.6);
    this.rimLight.position.set(2, 4, -4);
    this.scene.add(this.rimLight);

    // Specular light for front water droplets
    this.sparkleLight = new THREE.PointLight(0xffffff, 1.5, 8);
    this.sparkleLight.position.set(0, 1.2, 3.2);
    this.scene.add(this.sparkleLight);
  }

  initEnvironment() {
    // Studio floor shadow receiver plane (ultra-soft realistic contact shadow, never harsh/black)
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const shadowMat = new THREE.ShadowMaterial({
      opacity: 0.13
    });
    this.shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.position.y = -1.25;
    this.shadowPlane.receiveShadow = true;
    this.scene.add(this.shadowPlane);

    // Studio back wall shadow receiver plane for 3D HALVES typography (soft subtle depth)
    const wallGeo = new THREE.PlaneGeometry(22, 14);
    const wallMat = new THREE.ShadowMaterial({ opacity: 0.10 });
    this.backWall = new THREE.Mesh(wallGeo, wallMat);
    this.backWall.position.set(0, 0, -2.75);
    this.backWall.receiveShadow = true;
    this.scene.add(this.backWall);

    // Studio reflection room
    const pmremGen = new THREE.PMREMGenerator(this.renderer);
    pmremGen.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    const envGeo = new THREE.SphereGeometry(10, 16, 16);
    const envMat = new THREE.MeshBasicMaterial({
      color: 0xf3efe7,
      side: THREE.BackSide
    });
    envScene.add(new THREE.Mesh(envGeo, envMat));

    const boxGeo = new THREE.PlaneGeometry(6, 6);
    const boxMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sb1 = new THREE.Mesh(boxGeo, boxMat);
    sb1.position.set(5, 5, 5);
    sb1.lookAt(0, 0, 0);
    envScene.add(sb1);

    const sb2 = new THREE.Mesh(boxGeo, boxMat);
    sb2.position.set(-6, 3, 2);
    sb2.lookAt(0, 0, 0);
    envScene.add(sb2);

    this.scene.environment = pmremGen.fromScene(envScene).texture;
    pmremGen.dispose();
  }

  initObjects() {
    // 1. 3D Background Typography "H A L V E S"
    this.bgTypography = create3DBackgroundTypography();
    this.scene.add(this.bgTypography);

    // 2. The Main Can System (with 3 clipped bands + 3D physical droplets)
    this.canSystem = new HalvesCanSystem();
    this.scene.add(this.canSystem.group);

    // 3. Surrounding Hero Fruits (Exact Frame 00 matching)
    // Left Watermelon Wedge (Standing upright)
    this.heroWatermelonLeft = createWatermelonModel();
    this.heroWatermelonLeft.position.set(-2.05, -0.42, 0.35);
    this.heroWatermelonLeft.rotation.set(0.12, 0.45, -0.2);
    this.heroWatermelonLeft.scale.set(0.95, 0.95, 0.95);
    this.scene.add(this.heroWatermelonLeft);

    // Left Lime Cluster (3 whole limes with leaf neatly stacked)
    this.limeCluster = new THREE.Group();
    const lime1 = createLimeModel();
    lime1.position.set(-1.42, -0.92, 0.65);
    lime1.rotation.set(0.3, 0.2, 0.1);

    const lime2 = createLimeModel();
    lime2.position.set(-1.12, -0.92, 0.9);
    lime2.rotation.set(-0.2, 0.8, 0.3);
    lime2.scale.set(0.86, 0.86, 0.86);

    const lime3 = createLimeModel();
    lime3.position.set(-1.28, -0.52, 0.75);
    lime3.rotation.set(0.5, -0.4, 0.2);
    lime3.scale.set(0.88, 0.88, 0.88);

    this.limeCluster.add(lime1, lime2, lime3);
    this.scene.add(this.limeCluster);

    // Right Standing Watermelon Disc/Wedge (placed behind on the right)
    this.heroWatermelonRight = createWatermelonModel();
    this.heroWatermelonRight.position.set(2.05, -0.22, 0.05);
    this.heroWatermelonRight.rotation.set(-0.15, -0.6, 0.25);
    this.heroWatermelonRight.scale.set(0.95, 0.95, 0.95);
    this.scene.add(this.heroWatermelonRight);

    // Right Upright Lime Wheel (standing mid-ground, well clear of floor slice)
    this.heroLimeSlice = createLimeSliceModel();
    this.heroLimeSlice.position.set(1.15, -0.65, 0.55);
    this.heroLimeSlice.rotation.set(0.35, -0.45, 0.2);
    this.scene.add(this.heroLimeSlice);

    // Right Flat Floor Lime Wheel (resting flat in foreground, distinct position)
    this.heroLimeFloorSlice = createLimeSliceModel();
    this.heroLimeFloorSlice.position.set(0.65, -1.20, 1.35);
    this.heroLimeFloorSlice.rotation.set(Math.PI / 2, 0, 0.4);
    this.scene.add(this.heroLimeFloorSlice);

    // 3b. Glistening Crystal Jelly / Ice Cubes (Placed safely in foreground with zero can clipping)
    this.heroJelly1 = createIceCubeModel(0.36);
    this.heroJelly1.position.set(-0.75, -1.16, 1.32);
    this.heroJelly1.rotation.set(0.12, 0.55, 0.08);
    this.scene.add(this.heroJelly1);

    this.heroJelly2 = createIceCubeModel(0.26);
    this.heroJelly2.position.set(1.38, -1.18, 1.08);
    this.heroJelly2.rotation.set(-0.15, 0.82, 0.22);
    this.scene.add(this.heroJelly2);

    // 4. Orbiting Watermelon Slices for Section 4
    this.orbitGroup = new THREE.Group();
    this.orbitSlices = [];
    const orbitCount = 4;
    const orbitRadius = 1.95;
    for (let o = 0; o < orbitCount; o++) {
      const slice = createWatermelonModel();
      const angle = (o * Math.PI * 2) / orbitCount;
      slice.position.set(Math.cos(angle) * orbitRadius, (o % 2 === 0 ? 0.35 : -0.35), Math.sin(angle) * orbitRadius);
      slice.rotation.set(0.2, angle + Math.PI / 2, 0.1);
      slice.scale.set(0.8, 0.8, 0.8);
      this.orbitGroup.add(slice);
      this.orbitSlices.push(slice);
    }
    this.orbitGroup.position.set(0, 0, 0);
    this.orbitGroup.scale.set(0.001, 0.001, 0.001);
    this.scene.add(this.orbitGroup);

    // 5. Floating Ice Cubes for Section 5 (Red Impact)
    this.iceCubesGroup = new THREE.Group();
    this.iceCubes = [];
    const icePositions = [
      { x: 1.2, y: 1.1, z: 0.5, size: 0.45, rotSpeed: 0.01 },
      { x: 1.8, y: -0.6, z: 0.8, size: 0.4, rotSpeed: -0.015 },
      { x: -1.4, y: 1.3, z: 0.3, size: 0.35, rotSpeed: 0.012 },
      { x: 0.8, y: -1.2, z: 1.1, size: 0.5, rotSpeed: 0.008 }
    ];
    icePositions.forEach(cfg => {
      const cube = createIceCubeModel(cfg.size);
      cube.position.set(cfg.x, cfg.y, cfg.z);
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      this.iceCubesGroup.add(cube);
      this.iceCubes.push({ mesh: cube, cfg });
    });
    this.iceCubesGroup.position.set(0, 0, 0);
    this.iceCubesGroup.scale.set(0.001, 0.001, 0.001);
    this.scene.add(this.iceCubesGroup);
  }

  initEvents() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    if (this.width < 600) {
      // Mobile portrait: pull back camera and adjust FOV to keep can and text in frame
      this.camera.position.z = 7.8;
      this.camera.fov = 44;
    } else if (this.width < 1024) {
      this.camera.position.z = 6.6;
      this.camera.fov = 42;
    } else {
      this.camera.position.z = 5.8;
      this.camera.fov = 40;
    }
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / this.width) * 2 - 1;
    this.mouse.targetY = -(e.clientY / this.height) * 2 + 1;
  }

  update(time) {
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.camera.position.x = this.mouse.x * 0.22;
    this.camera.position.y = this.mouse.y * 0.16;
    this.camera.lookAt(0, 0, 0);

    // Subtle idle bobbing — stored as deltas, applied additively so animation controller still controls Y
    const idleY = Math.sin(time * 1.5) * 0.028;
    this.heroWatermelonLeft.position.y += idleY * 0.5;
    this.heroWatermelonRight.position.y -= idleY * 0.4;

    // Subtle parallax on the 3D HALVES background typography
    this.bgTypography.position.x = this.mouse.x * -0.15;
    this.bgTypography.position.y = 0.25 + this.mouse.y * -0.1;

    if (this.orbitGroup.scale.x > 0.1) {
      this.orbitGroup.rotation.y = time * 0.65;
    }

    if (this.iceCubesGroup.scale.x > 0.1) {
      this.iceCubes.forEach(ic => {
        ic.mesh.rotation.x += ic.cfg.rotSpeed;
        ic.mesh.rotation.y += ic.cfg.rotSpeed * 1.3;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}
