import * as THREE from 'three';

export const state = {
    mouse: new THREE.Vector2(),
    raycaster: new THREE.Raycaster(),
    isReady: false,
    isActive: false
}

let intersectedObject = null;
let button = null;
let camera = null;

export async function initInput(testButton, testCamera) {
    button = testButton;
    camera = testCamera;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
    state.isReady = true;
    state.isActive = true;
}

function onMouseMove(event) {
    state.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    state.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick() {
    if (intersectedObject === button) {
        const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
        button.backgroundColor.set(randomColor);
    }
}

export function updateInput(deltaTime) {
    state.raycaster.setFromCamera(state.mouse, camera);
    const intersects = state.raycaster.intersectObjects([button]);

    if (intersects.length > 0) {
        if (intersectedObject !== button) {
            intersectedObject = button;
            button.backgroundColor.set(0x007bff);
        }
    } else {
        if (intersectedObject !== null) {
            intersectedObject.backgroundColor.set(0x0056bb);
            intersectedObject = null;
        }
    }
}