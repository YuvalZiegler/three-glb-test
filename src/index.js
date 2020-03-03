import "./styles.css";

import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  DirectionalLight,
  Color
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// Instantiate a loader
var loader = new GLTFLoader();

var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

const FLAT_SHADING = false;
const ENABLE_SHADOWS = true;

function main() {
  const canvas = setupCanvas();
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  const scene = setupScene();
  const camera = setupCamera();

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Load a glTF resource
  loader.load(
    // resource URL
    "./C2X44L00.glb",
    // called when the resource is loaded
    function(gltf) {
      console.log(gltf);
      const mesh01 = gltf.scene.children[0];
      const mesh02 = gltf.scene.children[1];

      mesh02.material.flatShading = FLAT_SHADING;

      scene.add(mesh01);
      scene.add(mesh02);
    },
    // called while loading is progressing
    function(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function(error) {
      console.log("An error happened");
    }
  );

  setupLights(scene);

  /**
   * Render loop
   * @param time
   */
  function renderLoop(time = 0) {
    time *= 0.001; // convert time to seconds

    renderer.render(scene, camera);

    window.requestAnimationFrame(renderLoop);
  }

  window.requestAnimationFrame(renderLoop);
}

main();

function setupCanvas() {
  const root = document.getElementById("app");
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  root.appendChild(canvas);
  return canvas;
}

function setupScene() {
  const scene = new Scene();
  scene.background = new Color(0xaaaaaa);
  return scene;
}

function setupLights(scene) {
  const color = 0xffffff;
  const intensity = 1;
  const light = new DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  light.castShadow = ENABLE_SHADOWS;
  scene.add(light);
}

function setupCamera() {
  const fov = 45;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 5000;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 2, 200);
  camera.lookAt(0, 0, 0);
  return camera;
}
