import { initThree, updateThree, renderThree, state as threeState } from '/src/three.js';
import { initMeshUI, updateMeshUI, testButton, state as meshUIState } from '/src/meshUI';
import { initInput, updateInput, state as inputState } from '/src/input';
import { initXR, state as xrState } from '/src/XR.js';

const state = {
    isReady: false,
    isActive: false
};

let previousTime = 0;

async function runApp() {
    await initThree();
    await initMeshUI(threeState.scene);
    await initInput(testButton, threeState.camera);
    requestAnimationFrame(updateAndRenderThree);
    if (navigator.xr) {
        document.body.append(await createXRButtons());
    }
    state.isReady = true;
    state.isActive = true;
}

async function createXRButtons() {
    const isArSupported = await navigator.xr.isSessionSupported('immersive-ar');
    const isVrSupported = await navigator.xr.isSessionSupported('immersive-vr');
    let container = null;
    if (isArSupported || isVrSupported) {
        container = createXRButtonsContainer();
    }
    if (isArSupported) {
        const arButton = await createButton('Start AR', () => {
            initXR('immersive-ar', threeState, updateThree, renderThree)
        });
        container.append(arButton);
    }
    if (isVrSupported) {
        const vrButton = await createButton('Start VR', () => {
            initXR('immersive-vr', threeState, updateThree, renderThree)
        });
        container.append(vrButton);
    }
    return container;
}

function createXRButtonsContainer() {
    const container = document.createElement('div');
    container.classList.add('xr-buttons-container');
    return container;
}

async function createButton(buttonText, onClickHandler) {
    const button = document.createElement('button');
    button.innerText = buttonText;
    button.addEventListener('click', async () => {
        await onClickHandler();
        button.parentElement.remove();
    });
    return button;
}

function updateAndRenderThree(time) {
    if (xrState.isReady) {
        return;
    }
    requestAnimationFrame(updateAndRenderThree);
    const deltaTime = time - previousTime;
    previousTime = time;
    if (meshUIState.isActive) {
        updateMeshUI(deltaTime);
    }
    if (inputState.isActive) {
        updateInput(deltaTime);
    }
    if (threeState.isActive){

        updateThree(deltaTime);
    }
    renderThree();
}

document.addEventListener('DOMContentLoaded', async () => {
    await runApp();
});