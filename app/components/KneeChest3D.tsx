"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const DEG = Math.PI / 180;
const CYCLE = 4000; // ms per full loop

// ── Materials ─────────────────────────────────────────────────────────────
const MAT_SKIN   = new THREE.MeshLambertMaterial({ color: 0xe8b090 });
const MAT_SHIRT  = new THREE.MeshLambertMaterial({ color: 0x93c5fd });
const MAT_SHORTS = new THREE.MeshLambertMaterial({ color: 0x3b82f6 });
const MAT_HAIR   = new THREE.MeshLambertMaterial({ color: 0x3d2b1f });
const MAT_MAT    = new THREE.MeshLambertMaterial({ color: 0xcbd5e1 });

// ── Geometry helpers ───────────────────────────────────────────────────────
function cyl(rTop: number, rBot: number, len: number, seg = 10): THREE.BufferGeometry {
  return new THREE.CylinderGeometry(rTop, rBot, len, seg);
}

/** Creates a segment: pivot Group at joint origin, mesh extending downward (-Y) by `len`. */
function makeSeg(geo: THREE.BufferGeometry, mat: THREE.Material, len: number) {
  const pivot = new THREE.Group();
  const mesh  = new THREE.Mesh(geo, mat);
  mesh.position.y = -len / 2;
  mesh.castShadow = true;
  pivot.add(mesh);
  return pivot;
}

// ── Figure builder ─────────────────────────────────────────────────────────
interface Joints {
  root: THREE.Group;
  spine: THREE.Group;
  // L/R thigh, shin
  lThigh: THREE.Group; lShin: THREE.Group;
  rThigh: THREE.Group; rShin: THREE.Group;
  // L/R upper arm, forearm
  lUArm: THREE.Group; lFArm: THREE.Group;
  rUArm: THREE.Group; rFArm: THREE.Group;
}

function buildFigure(scene: THREE.Scene): Joints {
  // ── HIPS / ROOT ──
  const root = new THREE.Group();
  // Lying on back: rotate root so +Y axis points toward head (was standing)
  // We'll place root at pelvis; the body extends in +Y when "standing",
  // but we rotate 90° around Z so it lies along +X (head right).
  scene.add(root);

  // Pelvis mesh (compact cylinder)
  const pelvisMesh = new THREE.Mesh(cyl(0.3, 0.35, 0.5, 12), MAT_SHORTS);
  pelvisMesh.castShadow = true;
  root.add(pelvisMesh);

  // ── SPINE / TORSO ──
  const spine = new THREE.Group();
  spine.position.y = 0.25; // top of pelvis
  root.add(spine);
  const torsoMesh = new THREE.Mesh(cyl(0.42, 0.3, 2.0, 12), MAT_SHIRT);
  torsoMesh.position.y = 1.0; // center of torso above spine pivot
  torsoMesh.castShadow = true;
  spine.add(torsoMesh);

  // ── SHOULDERS ──
  const shoulderBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 1.0, 8),
    MAT_SHIRT
  );
  shoulderBar.rotation.z = Math.PI / 2;
  shoulderBar.position.y = 1.9;
  shoulderBar.castShadow = true;
  spine.add(shoulderBar);

  // ── NECK ──
  const neck = new THREE.Mesh(cyl(0.13, 0.15, 0.4, 8), MAT_SKIN);
  neck.position.y = 2.15;
  neck.castShadow = true;
  spine.add(neck);

  // ── HEAD ──
  const headGroup = new THREE.Group();
  headGroup.position.y = 2.55;
  spine.add(headGroup);
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 12), MAT_SKIN);
  headMesh.castShadow = true;
  headGroup.add(headMesh);
  // hair cap
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), MAT_HAIR);
  hairCap.rotation.x = -0.15;
  headGroup.add(hairCap);
  // Face details (eyes as small dark spheres)
  const eyeGeo = new THREE.SphereGeometry(0.06, 6, 6);
  const eyeMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
  const lEye = new THREE.Mesh(eyeGeo, eyeMat);
  lEye.position.set(0.2, 0.1, 0.43);
  const rEye = new THREE.Mesh(eyeGeo, eyeMat);
  rEye.position.set(-0.2, 0.1, 0.43);
  headGroup.add(lEye, rEye);
  // Nose
  const noseMesh = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), MAT_SKIN);
  noseMesh.position.set(0, -0.08, 0.48);
  headGroup.add(noseMesh);

  // ── LEFT ARM ──
  const lShoulder = new THREE.Group();
  lShoulder.position.set(0.5, 1.9, 0);
  spine.add(lShoulder);
  const lUArm = new THREE.Group(); // pivot at shoulder
  lShoulder.add(lUArm);
  const lUArmMesh = new THREE.Mesh(cyl(0.13, 0.12, 1.5, 8), MAT_SHIRT);
  lUArmMesh.position.y = -0.75;
  lUArmMesh.castShadow = true;
  lUArm.add(lUArmMesh);
  const lFArm = new THREE.Group(); // pivot at elbow
  lFArm.position.y = -1.5;
  lUArm.add(lFArm);
  const lFArmMesh = new THREE.Mesh(cyl(0.11, 0.10, 1.4, 8), MAT_SKIN);
  lFArmMesh.position.y = -0.7;
  lFArmMesh.castShadow = true;
  lFArm.add(lFArmMesh);
  // L hand
  const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), MAT_SKIN);
  lHand.position.y = -1.4;
  lFArm.add(lHand);

  // ── RIGHT ARM ──
  const rShoulder = new THREE.Group();
  rShoulder.position.set(-0.5, 1.9, 0);
  spine.add(rShoulder);
  const rUArm = new THREE.Group();
  rShoulder.add(rUArm);
  const rUArmMesh = new THREE.Mesh(cyl(0.13, 0.12, 1.5, 8), MAT_SHIRT);
  rUArmMesh.position.y = -0.75;
  rUArmMesh.castShadow = true;
  rUArm.add(rUArmMesh);
  const rFArm = new THREE.Group();
  rFArm.position.y = -1.5;
  rUArm.add(rFArm);
  const rFArmMesh = new THREE.Mesh(cyl(0.11, 0.10, 1.4, 8), MAT_SKIN);
  rFArmMesh.position.y = -0.7;
  rFArmMesh.castShadow = true;
  rFArm.add(rFArmMesh);
  const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), MAT_SKIN);
  rHand.position.y = -1.4;
  rFArm.add(rHand);

  // ── LEFT LEG ──
  const lThigh = new THREE.Group(); // pivot at hip socket
  lThigh.position.set(0.28, -0.25, 0);
  root.add(lThigh);
  const lThighMesh = new THREE.Mesh(cyl(0.19, 0.16, 2.0, 10), MAT_SHORTS);
  lThighMesh.position.y = -1.0;
  lThighMesh.castShadow = true;
  lThigh.add(lThighMesh);
  const lShin = new THREE.Group(); // pivot at knee
  lShin.position.y = -2.0;
  lThigh.add(lShin);
  const lShinMesh = new THREE.Mesh(cyl(0.14, 0.11, 1.9, 10), MAT_SKIN);
  lShinMesh.position.y = -0.95;
  lShinMesh.castShadow = true;
  lShin.add(lShinMesh);
  // L kneecap
  const lKnee = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), MAT_SKIN);
  lShin.add(lKnee);
  // L foot
  const lFoot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.32), MAT_SKIN);
  lFoot.position.set(0.15, -1.9, 0.05);
  lShin.add(lFoot);

  // ── RIGHT LEG ──
  const rThigh = new THREE.Group();
  rThigh.position.set(-0.28, -0.25, 0);
  root.add(rThigh);
  const rThighMesh = new THREE.Mesh(cyl(0.19, 0.16, 2.0, 10), MAT_SHORTS);
  rThighMesh.position.y = -1.0;
  rThighMesh.castShadow = true;
  rThigh.add(rThighMesh);
  const rShin = new THREE.Group();
  rShin.position.y = -2.0;
  rThigh.add(rShin);
  const rShinMesh = new THREE.Mesh(cyl(0.14, 0.11, 1.9, 10), MAT_SKIN);
  rShinMesh.position.y = -0.95;
  rShinMesh.castShadow = true;
  rShin.add(rShinMesh);
  const rKnee = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), MAT_SKIN);
  rShin.add(rKnee);
  const rFoot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.32), MAT_SKIN);
  rFoot.position.set(0.15, -1.9, -0.05);
  rShin.add(rFoot);

  return { root, spine, lThigh, lShin, rThigh, rShin, lUArm, lFArm, rUArm, rFArm };
}

// ── Pose applicator ────────────────────────────────────────────────────────
function applyPose(joints: Joints, t: number) {
  const hipFlex    = THREE.MathUtils.lerp(0,   115 * DEG, t);
  const kneeFlex   = THREE.MathUtils.lerp(0,   140 * DEG, t);
  const shouldFlex = THREE.MathUtils.lerp(0,        25 * DEG, t);
  const elbowFlex  = THREE.MathUtils.lerp(10 * DEG, 100 * DEG, t);
  const spineFlex  = THREE.MathUtils.lerp(0,   8 * DEG, t);

  // After root.rotation.set(0, -PI/2, -PI/2), root's local X = world Z (sagittal axis).
  // All sagittal-plane flexion must use .rotation.x.
  joints.spine.rotation.x  = spineFlex;

  joints.lThigh.rotation.x = -hipFlex;
  joints.rThigh.rotation.x = -hipFlex;

  joints.lShin.rotation.x  = kneeFlex;
  joints.rShin.rotation.x  = kneeFlex;

  joints.lUArm.rotation.x  = -shouldFlex;
  joints.rUArm.rotation.x  = -shouldFlex;

  joints.lFArm.rotation.x  = elbowFlex;
  joints.rFArm.rotation.x  = elbowFlex;
}

// ── Main component ─────────────────────────────────────────────────────────
export default function KneeChest3D() {
  const mountRef  = useRef<HTMLDivElement>(null);
  const stateRef  = useRef({ playing: true, elapsed: 0, lastTime: 0 });
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const el = mountRef.current!;
    const W = el.clientWidth;
    const H = el.clientHeight;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    // ── Scene ──
    const scene = new THREE.Scene();

    // ── Camera (3/4 view) ──
    const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 100);
    camera.position.set(4.5, 3.8, 5.5);
    camera.lookAt(0, 0.4, 0);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x8ecaff, 0.4);
    fill.position.set(-3, 2, -2);
    scene.add(fill);

    // ── Mat (exercise mat) ──
    const matMesh = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.08, 1.6),
      MAT_MAT
    );
    matMesh.position.set(1.5, -0.04, 0);
    matMesh.receiveShadow = true;
    scene.add(matMesh);

    // ── Figure ──
    const joints = buildFigure(scene);

    // Position figure: lying on back along +X axis
    // Root is at hips; we rotate so the figure lies with head in +X direction
    // "Standing" Y becomes the lying X; rotate -90° around Z
    // rotation.set(rx, ry, rz) with XYZ order:
    //   Ry(-90°): local +Z (chest) → world +X … then
    //   Rz(-90°): local +Z (now world +X) → world +Y (up)
    // Result: chest faces up, head points toward world +X
    joints.root.rotation.set(0, -Math.PI / 2, -Math.PI / 2);
    joints.root.position.set(0, 0.4, 0);

    // ── Animation loop ──
    let rafId: number;
    const state = stateRef.current;
    state.lastTime = performance.now();

    function animate(now: number) {
      rafId = requestAnimationFrame(animate);
      const delta = now - state.lastTime;
      state.lastTime = now;

      if (state.playing) {
        state.elapsed = (state.elapsed + delta) % CYCLE;
      }

      // t oscillates 0→1→0 (sine easing)
      const phase = (state.elapsed / CYCLE) * Math.PI * 2;
      const t = (1 - Math.cos(phase)) / 2;

      applyPose(joints, t);
      renderer.render(scene, camera);
    }
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  function togglePlay() {
    stateRef.current.playing = !stateRef.current.playing;
    setPlaying((p) => !p);
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div
        ref={mountRef}
        className="w-52 h-52 rounded-xl overflow-hidden bg-slate-50"
      />
      <button
        onClick={togglePlay}
        className="text-slate-500 hover:text-blue-500 transition-colors text-base"
        aria-label={playing ? "정지" : "재생"}
      >
        {playing ? "⏸" : "▶"}
      </button>
    </div>
  );
}
