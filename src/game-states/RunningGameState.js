import { GameState } from "./GameState.js";

import { GLTFLoader } from "../../common/engine/gltf-loader/GLTFLoader.js";
import { Renderer } from "../../common/engine/graphics/Renderer.js";
import { DataLoader } from "../../common/engine/data-loader/DataLoader.js";

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

        this.dataLoader = null;

        this.loadedItems = {
            selectedMapUrl: null,
            selectedTankUrl: null,
        };

        this.exitItems = {
            allTanks: 0,
            destroyedTanks: 0,
            pickupsCollected: 0,
        };

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
        this.gltfLoader = new GLTFLoader();
        this.renderer = new Renderer(this.gl);

        this.keydownHandler = this.keydownHandler.bind(this);
    }

    /**
     * Updates the state of everything in the current game state.
     * @param {Number} dt - delta time. The time difference since the last update.
     * @returns the exit code, which is needed to signal the end of the state.
     */
    update(dt) {
        return this.exitCode;
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
        if (!items.selectedMapUrl || !items.selectedTankUrl) {
            throw new Error("Previous state hasn't unloaded the correct data.");
        }
        this.loadedItems.selectedMapUrl = items.selectedMapUrl;
        this.loadedItems.selectedTankUrl = items.selectedTankUrl;
        console.log(this.loadedItems);
        await this._setupGameObjects();
        // As this is not the first state, the event listener must be added during
        // loading, to prevent a key pressed in the previous state to register in 
        // this state too.
        document.addEventListener("keydown", this.keydownHandler);
    }

    /**
     * Unloads data to the next game state.
     * @returns {Object} the object of items to be loaded in the next state. 
     */
    unload() {
        return this.exitItems;
    }

    /**
     * Clears all the data of the current game state.
     */
    delete() {
        RunningGameState.count = (RunningGameState.count - 1 < runningConstants.minInstances)
            ? runningConstants.minInstances : RunningGameState.count - 1;

        if (this.gl) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl = null;
        }

        this.scene = null;
        this.camera = null;
        this.light = null;

        this.gltfLoader = null;
        this.dataLoader = null;

        this.renderer = null;

        document.removeEventListener("keydown", this.keydownHandler);
    }

    /**
     * The handler for a keydown event, which is used to exit the game state.
     * @param {Event} e - the event that occurs on keydown.
     */
    async keydownHandler(e) {
        if (e.code === "Escape") {
            // Move back to start screen, but prompt the user first.
            if (confirm("Are you sure you want to leave the game?")) {
                // The function must have a timeout, otherwise the redirect fails with the
                // NS_BINDING_ABORTED flag.
                setTimeout(function () { document.location = "/index.html"; }, 500);
                return false;
            }
        }
    }

    // PRIVATE METHODS

    /**
     * Sets up the game objects that couldn't be initialized in the "init" method 
     * due to lack of data.
     * @private
     */
    async _setupGameObjects() {
        this.dataLoader = new DataLoader(
            this.loadedItems.selectedMapUrl,
            this.loadedItems.selectedTankUrl
        );
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