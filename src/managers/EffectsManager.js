/**
 * @class EffectsManager - class that manages graphical environmental effects.
 */
export class EffectsManager {

    /**
     * Constructs a new EffectsManager object.
     */
    constructor() {
        this.scene = null;
        this.camera = null;
        this.light = null;
        this.renderer = null;
        this.gameObjects = new Array();
    }

    /**
     * Initializes the effects manager with objects needed for manipulating effects.
     * @param {Object} scene - the scene of the current game state.
     * @param {Object} camera - the camera of the current game state.
     * @param {Object} light - the light of the current game state.
     * @param {Object} renderer - the renderer of the current game state.
     * @param {Array} gameObjects - all objects in the current game state.
     */
    init(scene, camera, light, renderer, gameObjects = null) {
        if (!scene) {
            throw new Error("Effects manager needs a reference to the scene.");
        }
        if (!camera) {
            throw new Error("Effects manager needs a reference to the camera.");
        }
        if (!light) {
            throw new Error("Effects manager needs a reference to the light.");
        }
        if (!renderer) {
            throw new Error("Effects manager needs a reference to the renderer.");
        }

        this.scene = scene;
        this.camera = camera;
        this.light = light;
        this.renderer = renderer;
        if (gameObjects) {
            this.gameObjects = gameObjects;
        }
    }

    simulateLightning() {

    }

    simulateDayCycle() {

    }

    simulateFog() {

    }

}