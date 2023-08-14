import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = null;

// load model
const loader = new GLTFLoader();

loader.load('r2d2.glb', function (gltf) {

    scene.add(gltf.scene);

}, function (xhr) {

    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

}, function (error) {

    console.error(error);

});


const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(-10, 10, -10).normalize();
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemisphereLight.position.set(1, 1, 1);
scene.add(hemisphereLight);




let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;

const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

const resize = (width: number, height: number) => {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    controls.update();

};

export const createScene = (el: HTMLElement, width: number, height: number) => {
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el, alpha: true });

    camera = new THREE.PerspectiveCamera(28, width / height, 1, 50);
    camera.position.z = 5;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false
    controls.enableZoom = false
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    resize(width, height);
    animate();
};