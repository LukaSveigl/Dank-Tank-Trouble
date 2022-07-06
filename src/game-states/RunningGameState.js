import { GameState } from "./GameState.js";

//import { Renderer } from "../../common/engine/graphics/Renderer.js"
//import { GLTFLoader } from "../../common/engine/gltf-loader/GLTFLoader.js"

/**
 * @class RunningGameState - the game state in which the main game is run.
 */
export class RunningGameState extends GameState {

    /**
     * Constructs a new SelectMapState object.
     * @param {Object} gl - the WebGL object. 
     */
    constructor(gl) {
        super(gl);

        RunningGameState.count++;
        if (RunningGameState.count > runningConstants.maxInstances) {
            RunningGameState.count--;
            throw new Error("Only one instance of RunningGameState can be active at a time!");
        }
    }

    /**
     * Initializes the state after it has been created.
     */
    async init() {

    }

    /**
     * Updates the state of everything in the current game state.
     * @param {Number} dt - delta time. The time difference since the last update.
     * @returns the exit code, which is needed to signal the end of the state.
     */
    update(dt) {

    }

    /**
     * Renders the game state scene.
     */
    render() {
        // If renderer, camera and light objects exits, render the current scene - this is needed due
        // to the asynchronous nature of the init method.
        if (this.renderer && this.camera && this.light) {
            this.renderer.render(this.scene, this.camera, this.light);
        }
    }

    /**
     * Loads the data that needs to be communicated between the previous and current state.
     * @param {Object} items - items to be loaded from the previous game state. 
     */
    async load(items) {

    }

    /**
     * Unloads data to the next game state.
     * @returns the object of items to be loaded in the next state. 
     */
    unload() {

    }

    /**
     * Clears all the data of the current game state.
     */
    delete() {

    }

    /**
     * Clears all the data of the current game state.
     */
    delete() {
        RunningGameState.count = (RunningGameState.count - 1 < runningConstants.minInstances)
            ? runningConstants.minInstances : RunningGameState.count - 1;

        this.gl = null;

        this.scene = null;
        this.camera = null;
        this.light = null;

        this.gltfLoader = null;

        this.renderer = null;
    }

}

// The class count is needed to ensure only one of such class is created,
// thus making it a singleton. This is because the game can exist in only 
// one such state at a time.
RunningGameState.count = 0;

const runningConstants = {
    minInstances: 0,
    maxInstances: 1,
};

Object.freeze(runningConstants);