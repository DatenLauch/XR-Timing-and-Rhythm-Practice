export const state = {
    xrSession: null,
    isActive: false
}

let three = null;
let updateThree = null;
let renderThree = null;
let previousTime = 0;

const arFeatures = {
    requiredFeatures: ['local-floor'],
    optionalFeatures: ['plane-detection', 'hit-test', 'anchors']
}
const vrFeatures = {
    requiredFeatures: ['local-floor'],
    optionalFeatures: ['viewer']
}

export async function initXR(sessionType, threeState, updateThreeFunc, renderThreeFunc) {
    if (sessionType === 'immersive-ar') {
        state.xrSession = await navigator.xr.requestSession(sessionType, arFeatures);
    }
    if (sessionType === 'immersive-vr') {
        state.xrSession = await navigator.xr.requestSession(sessionType, vrFeatures);
    }

    three = threeState;
    updateThree = updateThreeFunc;
    renderThree = renderThreeFunc;

    three.renderer.xr.enabled = true;
    await three.renderer.xr.setSession(state.xrSession);
    state.xrSession.requestAnimationFrame(updateAndRenderXR);
    state.isActive = true;
}

function updateAndRenderXR(time, frame) {
    frame.session.requestAnimationFrame(updateAndRenderXR);
    const deltaTime = time - previousTime;
    previousTime = time;

    if (three.cube.material.color.getHex() !== 0x0000ff) {
        three.cube.material.color.set(0x0000ff);
    }
    three.cube.rotation.x -= 0.02;
    three.cube.rotation.y -= 0.02;

    updateThree(deltaTime);
    renderThree();
}