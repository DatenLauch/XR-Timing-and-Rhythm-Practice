import * as THREE from 'three';

export const state = {
    renderer: null,
    camera: null,
    scene: null,
    directionalLight: null,
    ambientLight: null,
    cube: null,
    isReady: false,
    isActive: false
};

export async function initThree() {
    state.renderer = initRenderer();
    document.body.appendChild(state.renderer.domElement);

    state.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    state.camera.position.set(0, 1.5, 2);

    state.scene = new THREE.Scene();

    state.ambientLight = new THREE.AmbientLight(0xffffff)
    state.scene.add(state.ambientLight);
    state.directionalLight = new THREE.DirectionalLight(0xffffff);
    state.directionalLight.castShadow = true;
    state.directionalLight.position.set(1, 1, 1).normalize();
    state.scene.add(state.directionalLight);

    state.cube = createTestCube();
    state.cube.position.set(0, 2, -5);
    state.scene.add(state.cube);

    const cube2 = createTestCube();
    cube2.position.set(0, 0, -5);
    cube2.scale.set(100, 1, 100);
    state.scene.add(cube2);

    window.addEventListener('resize', onWindowResize);

    state.isReady = true;
    state.isActive = true;
}

function initRenderer(){
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
}

function createTestCube(){
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    return cube;
}

function onWindowResize() {
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
}


export function updateThree(deltaTime) {
    if (state.cube) {
        state.cube.rotation.y += 0.002 * deltaTime;
    }
}

export function renderThree() {
    state.renderer.render(state.scene, state.camera);
}
