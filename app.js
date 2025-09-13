import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x808080, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x808080);

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2.5;
controls.maxDistance = 8;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.25));
const hemi = new THREE.HemisphereLight(0xffffff, 0x202025, 0.7);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 0.9);
dir.position.set(3, 5, 4);
scene.add(dir);

// Helpers (debug)
const grid = new THREE.GridHelper(12, 24, 0x444444, 0x222222);
grid.position.y = -1.1;
scene.add(grid);
const axes = new THREE.AxesHelper(0.6);
axes.position.set(0, -1.1, 0);
scene.add(axes);

// Floor
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(6, 64),
  new THREE.MeshStandardMaterial({ color: 0x1b1e24, roughness: 1 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.12;
scene.add(floor);

const lowColor = new THREE.Color('#6ecb63');
const midColor = new THREE.Color('#ffb703');
const highColor = new THREE.Color('#e63946');

function tensionToColor(t) {
  // t in [0,1]
  if (t < 0.5) {
    return lowColor.clone().lerp(midColor, t / 0.5);
  }
  return midColor.clone().lerp(highColor, (t - 0.5) / 0.5);
}

// Simple humanoid made of capsules
function createCapsule(radius, length, color) {
  const geom = new THREE.CapsuleGeometry(radius, length, 8, 16);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1 });
  const mesh = new THREE.Mesh(geom, mat);
  return mesh;
}

const rigRoot = new THREE.Group();
scene.add(rigRoot);

// Torso
const torso = createCapsule(0.25, 1.2, 0x9bb1c8);
torso.rotation.z = Math.PI / 2;
rigRoot.add(torso);

// Pelvis and shoulders as joints (spheres) used for picking
function createJoint(radius = 0.08) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 24, 16),
    new THREE.MeshStandardMaterial({ color: 0xdddddd, emissive: 0x000000 })
  );
  return mesh;
}

const pelvis = createJoint(0.1);
pelvis.position.set(0, -0.7, 0);
rigRoot.add(pelvis);

const chest = createJoint(0.1);
chest.position.set(0, 0.7, 0);
rigRoot.add(chest);

// Head
const neck = createJoint(0.08);
neck.position.set(0, 1.2, 0);
rigRoot.add(neck);
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.22, 24, 16),
  new THREE.MeshStandardMaterial({ color: 0xc7d3e0 })
);
head.position.copy(neck.position).add(new THREE.Vector3(0, 0.28, 0));
rigRoot.add(head);

// Limbs: upper/lower arms and legs
function createLimbChain(basePos, isArm) {
  const group = new THREE.Group();
  group.position.copy(basePos);

  const upper = createCapsule(0.11, 0.6, 0xa7c957);
  const upperPivot = new THREE.Group();
  upperPivot.add(upper);
  upper.position.y = -0.35;
  group.add(upperPivot);

  const elbow = createJoint(0.08);
  elbow.position.y = -0.7;
  group.add(elbow);

  const lower = createCapsule(0.095, 0.55, 0x6aa84f);
  const lowerPivot = new THREE.Group();
  lowerPivot.position.y = -0.7;
  lowerPivot.add(lower);
  lower.position.y = -0.32;
  group.add(lowerPivot);

  const wristOrAnkle = createJoint(0.07);
  wristOrAnkle.position.y = -1.05;
  group.add(wristOrAnkle);

  // Store references for interaction and tension coloring
  group.userData = {
    upper, lower, upperPivot, lowerPivot,
    elbow, endJoint: wristOrAnkle,
    isArm
  };

  return group;
}

const leftShoulder = createJoint(0.09);
leftShoulder.position.set(-0.45, 0.7, 0);
rigRoot.add(leftShoulder);
const rightShoulder = createJoint(0.09);
rightShoulder.position.set(0.45, 0.7, 0);
rigRoot.add(rightShoulder);

const leftArm = createLimbChain(leftShoulder.position, true);
const rightArm = createLimbChain(rightShoulder.position, true);
rigRoot.add(leftArm);
rigRoot.add(rightArm);

const leftHip = createJoint(0.09);
leftHip.position.set(-0.25, -0.7, 0);
rigRoot.add(leftHip);
const rightHip = createJoint(0.09);
rightHip.position.set(0.25, -0.7, 0);
rigRoot.add(rightHip);

const leftLeg = createLimbChain(leftHip.position, false);
const rightLeg = createLimbChain(rightHip.position, false);
rigRoot.add(leftLeg);
rigRoot.add(rightLeg);

// Debug cube to verify rendering
const debugCube = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.2, 0.2),
  new THREE.MeshStandardMaterial({ color: 0xff00ff })
);
debugCube.position.set(0, 0, 0.5);
scene.add(debugCube);

// Camera framing
camera.position.set(0, 1.1, 4.6);
controls.target.set(0, 0.6, 0);
controls.update();

// Picking setup
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let activeJoint = null;
let isDragging = false;

const pickables = [
  leftShoulder, rightShoulder, leftHip, rightHip, pelvis, chest, neck,
  leftArm.userData.elbow, leftArm.userData.endJoint,
  rightArm.userData.elbow, rightArm.userData.endJoint,
  leftLeg.userData.elbow, leftLeg.userData.endJoint,
  rightLeg.userData.elbow, rightLeg.userData.endJoint
];

function onPointerDown(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(pickables, false);
  if (intersects.length > 0) {
    activeJoint = intersects[0].object;
    isDragging = true;
    controls.enabled = false;
  }
}

function onPointerUp() {
  isDragging = false;
  activeJoint = null;
  controls.enabled = true;
}

function onPointerMove(event) {
  if (!isDragging || !activeJoint) return;
  const deltaX = event.movementX || 0;
  const deltaY = event.movementY || 0;

  // Map drag to joint rotations depending on which joint is active
  const speed = 0.01;

  const limbGroups = [leftArm, rightArm, leftLeg, rightLeg];
  for (const group of limbGroups) {
    const { upperPivot, lowerPivot, elbow, endJoint, isArm } = group.userData;
    if (activeJoint === group || activeJoint === elbow || activeJoint === endJoint) {
      // Shoulder/Hip rotation affects upperPivot
      if (activeJoint.position.distanceTo(group.position) < 0.001) {
        upperPivot.rotation.z += deltaX * speed * (group.position.x < 0 ? 1 : -1);
        upperPivot.rotation.x += deltaY * speed;
      }
      // Elbow/Knee flexion
      if (activeJoint === elbow) {
        lowerPivot.rotation.x += deltaY * speed;
        lowerPivot.rotation.x = THREE.MathUtils.clamp(lowerPivot.rotation.x, -Math.PI * 0.05, Math.PI * 0.95);
      }
      // Wrist/Ankle simple twist
      if (activeJoint === endJoint) {
        lowerPivot.rotation.z += deltaX * speed * (group.position.x < 0 ? 1 : -1);
      }
    }
  }

  updateMuscleTensionColors();
}

renderer.domElement.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointerup', onPointerUp);
window.addEventListener('pointermove', onPointerMove);

// Muscle tension proxy: use amount of rotation from neutral
function computeTensionFromRotation(rot) {
  const magnitude = Math.min(1, (Math.abs(rot.x) + Math.abs(rot.y) + Math.abs(rot.z)) / (Math.PI * 1.2));
  return magnitude;
}

function colorLimbByTension(mesh, tension) {
  const col = tensionToColor(tension);
  mesh.material.color.copy(col);
  mesh.material.needsUpdate = true;
}

function updateMuscleTensionColors() {
  for (const limb of [leftArm, rightArm, leftLeg, rightLeg]) {
    const tUpper = computeTensionFromRotation(limb.userData.upperPivot.rotation);
    const tLower = computeTensionFromRotation(limb.userData.lowerPivot.rotation);
    colorLimbByTension(limb.userData.upper, tUpper);
    colorLimbByTension(limb.userData.lower, tLower);
  }
}

// Reset posture button
const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', () => {
  for (const limb of [leftArm, rightArm, leftLeg, rightLeg]) {
    limb.userData.upperPivot.rotation.set(0, 0, 0);
    limb.userData.lowerPivot.rotation.set(0, 0, 0);
  }
  updateMuscleTensionColors();
});

function onResize() {
  let w = canvas.clientWidth;
  let h = canvas.clientHeight;
  if (!w || !h) {
    w = window.innerWidth;
    h = window.innerHeight;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(dpr);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

// Initial size
onResize();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
