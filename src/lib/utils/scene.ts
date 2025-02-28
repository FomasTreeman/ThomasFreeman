import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { r2d2Loaded } from '$lib/stores';

const scene = new THREE.Scene();
scene.background = null;


// load model
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

loader.load('/r2d2.glb', function (gltf) {

    r2d2Loaded.set(true)
    scene.add(gltf.scene);

}, function (xhr) {

    // console.log((xhr.loaded / xhr.total * 100) + '% loaded');

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
let animationFrameId: number;

const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    if (controls && renderer && camera) {
        controls.update();
        renderer.render(scene, camera);
    }
};

const resize = (width: number, height: number) => {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    controls.update();

};

const cleanup = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (renderer) {
        renderer.dispose();
    }
    if (controls) {
        controls.dispose();
    }
};

export const createScene = (el: HTMLElement, width: number, height: number) => {
    cleanup();
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