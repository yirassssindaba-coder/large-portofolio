const CDN_VERSION = '0.181.0';

function ensureMotionModal() {
  let modal = document.getElementById('motionFlowModal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'motionFlowModal';
  modal.className = 'motion-flow-modal';
  modal.innerHTML = `
    <div class="motion-flow-backdrop" data-close-motion></div>
    <div class="motion-flow-panel" role="dialog" aria-modal="true" aria-labelledby="motionFlowTitle">
      <div class="motion-flow-head">
        <div>
          <div class="eyebrow">Three.js Motion Flow</div>
          <h3 id="motionFlowTitle">3D motion core.</h3>
        </div>
        <button class="icon-btn" type="button" data-close-motion aria-label="Tutup Motion Flow">✕</button>
      </div>
      <p class="motion-flow-copy">Panggung 3D interaktif untuk memperkuat tombol Motion Flow: gerak pointer memiringkan model, cahaya ikut berubah, dan animasi tetap ringan saat dibuka dari desain PulseBoard.</p>
      <div class="motion-flow-stage" id="motionFlowStage">
        <div class="motion-flow-status" id="motionFlowStatus">Memuat Three.js…</div>
        <canvas id="motionFlowCanvas"></canvas>
      </div>
      <div class="motion-flow-meta">
        <span class="pill">Interactive</span>
        <span class="pill">WebGL</span>
        <span class="pill">Three.js</span>
      </div>
    </div>`;
  document.body.appendChild(modal);
  return modal;
}

function lockScroll(locked) {
  document.documentElement.classList.toggle('motion-open', locked);
  document.body.classList.toggle('motion-open', locked);
}

let sceneReady = false;

async function initThreeScene() {
  if (sceneReady) return;
  const status = document.getElementById('motionFlowStatus');
  const canvas = document.getElementById('motionFlowCanvas');
  if (!canvas) return;

  try {
    const THREE = await import(`https://cdn.jsdelivr.net/npm/three@${CDN_VERSION}/build/three.module.js`);
    const stage = document.getElementById('motionFlowStage');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 7.2);

    const ambient = new THREE.AmbientLight(0x88aaff, 1.15);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0x9be7ff, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x6df7c1, 22, 30, 2);
    rim.position.set(-3, -1.2, 5);
    scene.add(rim);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    const mainGeo = new THREE.TorusKnotGeometry(1.45, 0.42, 180, 24);
    const mainMat = new THREE.MeshPhysicalMaterial({
      color: 0x8df6d1,
      emissive: 0x0f4d4a,
      emissiveIntensity: 1.2,
      roughness: 0.18,
      metalness: 0.55,
      clearcoat: 1,
      clearcoatRoughness: 0.12
    });
    rootGroup.add(new THREE.Mesh(mainGeo, mainMat));

    const shellGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const shellMat = new THREE.MeshBasicMaterial({ color: 0x6dc7ff, wireframe: true, transparent: true, opacity: 0.22 });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    rootGroup.add(shell);

    const glowGeo = new THREE.SphereGeometry(3.3, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x1fbf98, transparent: true, opacity: 0.08 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.6 + Math.random() * 1.8;
      const y = (Math.random() - 0.5) * 3.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xe9fff9, size: 0.045, transparent: true, opacity: 0.92 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const getBounds = () => stage.getBoundingClientRect();
    const pointer = { x: 0, y: 0 };
    stage.addEventListener('pointermove', (event) => {
      const rect = getBounds();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    });
    stage.addEventListener('pointerleave', () => {
      pointer.x = 0;
      pointer.y = 0;
    });

    const resize = () => {
      const rect = getBounds();
      const width = Math.max(rect.width, 280);
      const height = Math.max(rect.height, 280);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      rootGroup.rotation.x += (pointer.y * 0.35 - rootGroup.rotation.x) * 0.06;
      rootGroup.rotation.y += (pointer.x * 0.55 + elapsed * 0.22 - rootGroup.rotation.y) * 0.06;
      rootGroup.position.y = Math.sin(elapsed * 1.1) * 0.12;
      shell.rotation.x = elapsed * 0.14;
      shell.rotation.z = elapsed * 0.12;
      glow.scale.setScalar(1 + Math.sin(elapsed * 1.8) * 0.04);
      particles.rotation.y = elapsed * 0.06;
      particles.rotation.x = Math.sin(elapsed * 0.4) * 0.08;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    sceneReady = true;
    status?.remove();
  } catch (error) {
    console.error(error);
    if (status) status.textContent = 'Three.js tidak berhasil dimuat. Jalankan lewat server atau cek koneksi internet.';
  }
}

function openMotionFlow() {
  const modal = ensureMotionModal();
  modal.classList.add('is-open');
  lockScroll(true);
  initThreeScene();
}

function closeMotionFlow() {
  const modal = document.getElementById('motionFlowModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  lockScroll(false);
}

const trigger = document.getElementById('motionFlowButton');
if (trigger) {
  trigger.addEventListener('click', openMotionFlow);
  document.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute('data-close-motion')) {
      closeMotionFlow();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMotionFlow();
  });
}
