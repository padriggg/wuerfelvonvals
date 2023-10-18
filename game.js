//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

//import * as THREE from '/lib/three.js';

//import * as THREE from '/lib/three.module.js';

import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
//import * as THREE from './lib/three';

//import GUI from '/node_modules/dat.gui';
//import * as THREE from '/build/three.module.js';

//import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
//import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
//import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import * as THREE from '/node_modules/three/build/three.module.js';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(2);

const pointLight = new THREE.PointLight(0xffffff, 100, 1000, 2);
pointLight.position.set(45, 2, 45);

const dLightHelper = new THREE.PointLightHelper(pointLight);

const pointLight1 = new THREE.DirectionalLight(0xffffff, 1);
pointLight1.position.set(-45, 20, -45);
const dLightHelper1 = new THREE.DirectionalLightHelper(pointLight1);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
ambientLight.position.set(-45, 0, -45);
scene.add(ambientLight);

scene.add(pointLight, ambientLight, pointLight1, dLightHelper, dLightHelper1);

//const geometry = new THREE.BoxGeometry(100, 100, 100, 100);
//const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe:true});
//const cube = new THREE.Mesh(geometry, material);

//scene.add(cube);
camera.position.z = 50;

const geometry1 = new THREE.TorusGeometry(36, 10, 16, 100);
const material1 = new THREE.MeshStandardMaterial({
  color: 0xff6347,
  roughness: 0.4,
});

const torus = new THREE.Mesh(geometry1, material1);

scene.add(torus);

const geometry3 = new THREE.PlaneGeometry(600, 600);

const material3 = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.1,
  side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(geometry3, material3);

scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

const ebeneY = 300;
plane.position.y = -ebeneY;

//const gloader = new GLTFLoader();
//gloader.load('./mech_drone/scene.gltf', (drone) => {

//   scene.add(drone.scene);
//});
const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

const stars = [];

const yPos = [];
const starRot = [];

function addStar() {
  const geometry = new THREE.SphereGeometry(getRandom(0.5, 7), 24, 24);
  const material = new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
    roughness: 0.9,
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(ebeneY * 2 - 10));

  // const angel = (index / 100) * Math.PI * 2;
  //const x = circelCenter.x + circelRadius * Math.cos(angel);
  //const y = circelCenter.y + circelRadius * Math.sin(angel);

  star.position.set(x, y, z);
  stars.push(star);
  yPos.push(star.position.y);

  scene.add(star);

  starRot.push(getRandom(-0.08, 0.08));
}

Array(200).fill().forEach(addStar);

const jeffTexture = new THREE.TextureLoader().load("jeff.png");

const box = [
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: new THREE.TextureLoader().load("jeff.png"),
  }),
  new THREE.MeshStandardMaterial({ map: addVideo() }),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: new THREE.TextureLoader().load("jeff.png"),
  }),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: new THREE.TextureLoader().load("click.png"),
  }),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: new THREE.TextureLoader().load("jeff.png"),
  }),
  new THREE.MeshStandardMaterial({ map: addVideo() }),
];

const jeff = new THREE.Mesh(new THREE.BoxGeometry(27, 27, 27), box);

scene.add(jeff);

const donut = new THREE.TextureLoader().load("1.png");

const geometry2 = new THREE.SphereGeometry(15, 75, 4);
const material2 = new THREE.MeshStandardMaterial(
  //map: moonTexture, normalMap: normalTexture,
  { map: moonTexture, map: donut, roughness: 0.4 }
);

const moon = new THREE.Mesh(geometry2, material2);

scene.add(moon);

moon.position.y = 64;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isFalling = false;

document.addEventListener("click", onClick);

function onClick(event) {
  event.preventDefault();

  // Berechnen Sie die Mausposition im Normalized Device Coordinates (NDC)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Aktualisieren Sie den Raycaster mit der Kamera und Mausposition
  raycaster.setFromCamera(mouse, camera);

  // Überprüfen Sie, ob der Raycaster die Kugel trifft
  const intersects = raycaster.intersectObject(torus);

  if (intersects.length > 0) {
    document.body.style.cursor = "pointer";

    // Ändern Sie die Farbe der Kugel zufällig
    const newColor = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    );

    torus.material.color.set(newColor);
    //jeff.material.color.set(newColor);
    pointLight.color.set(newColor);
    pointLight1.color.set(newColor);
  } else {
    document.body.style.cursor = "auto";
  }

  const intersects1 = raycaster.intersectObject(jeff);

  if (intersects1.length > 0) {
    document.body.style.cursor = "pointer";

    // Ändern Sie die Farbe der Kugel zufällig

    if (!isFalling) {
      isFalling = true;
    } else {
      isFalling = false;
    }
  } else {
    document.body.style.cursor = "auto";
  }
}

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  "./penguins/arid_ft.jpg",
  "./penguins/arid_bk.jpg",
  "./penguins/arid_up.jpg",
  "./penguins/arid_dn.jpg",
  "./penguins/arid_rt.jpg",
  "./penguins/arid_lf.jpg",
]);

const gui = new dat.GUI();

gui.add(pointLight.position, "x");
gui.add(pointLight.position, "y");
gui.add(pointLight.position, "z");

const options = {
  color: 0xff0000,
  wireframe: false,
  speed: 0.01,
};

gui.addColor(options, "color").onChange(function (e) {
  pointLight.color.set(e), pointLight1.color.set(e);
});

gui.add(options, "wireframe").onChange(function (e) {
  (torus.material.wireframe = e),
    (jeff.material.wireframe = e),
    (moon.material.wireframe = e);
});

gui.add(options, "speed", 0, 0.01);

function addVideo() {
  const video = document.getElementById("myVideo");

  const videoTex = new THREE.VideoTexture(video);
  videoTex.minFilter = THREE.LinearFilter;
  videoTex.magFilter = THREE.LinearFilter;

  return videoTex;
}

let step = 0;
scene.background = texture;

console.log(yPos);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  torus.rotation.x += 0.006;
  torus.rotation.y += 0.006;
  torus.rotation.z += 0.006;

  moon.rotation.y -= 0.02;

  stars.forEach((star, index) => {
    star.rotation.y += starRot[index];
  });

  if (isFalling) {
    stars.forEach((star, index) => {
      step += options.speed;

      let dist = yPos[index] + ebeneY;

      star.position.y =
        dist * Math.abs(Math.cos((1 / Math.sqrt(dist)) * step)) - ebeneY;
    });
  }

  /* stars.forEach((star, index) => {
 
 
     const angel = (index + 1) / AnzMonde * Math.PI * 2;
     const x = star.position.x //* Math.cos(angel+0.1);
     const z = star.position.z //* Math.sin(angel+0.1);
 
     star.position.set(x, star.position.y, z);
 
 
 
   });*/

  document.addEventListener("click", () => {
    const video = document.getElementById("myVideo");
    video.play();
  });

  controls.update();
}
animate();
