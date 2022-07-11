import { GameState } from "./GameState.js";

import { DataLoader } from "../../common/engine/data-loader/DataLoader.js";

import { Renderer } from "../../common/engine/graphics/Renderer.js";
import { GLTFLoader } from "../../common/engine/gltf-loader/GLTFLoader.js";

import { Light } from "../../common/engine/gltf-loader/gltf-components/Light.js";

import { vec3, mat4 } from "../../lib/gl-matrix-module.js";

/**
 * @class SelectMapState - game state that implements the selection of the game map.
 */
export class SelectMapState extends GameState {

    /**
     * Constructs a new SelectMapState object.
     * @param {Object} gl - the WebGL object. 
     */
    constructor(gl) {
        super(gl);

        this.dataLoader = null;

        this.currentMapIndex = 0;

        this.timeValues = {
            time: Date.now(),
            startTime: Date.now(),
            deltaTime: 0,
        };

        SelectMapState.count++;
        if (SelectMapState.count > selectMapConstants.maxInstances) {
            SelectMapState.count--;
            throw new Error("Only one instance of SelectMapState can be active at a time!");
        }
    }

    /**
     * Initializes the state after it has been created.
     */
    async init() {
        this.dataLoader = new DataLoader(selectMapConstants.previewsPath, null);
        this.gltfLoader = new GLTFLoader();
        this.renderer = new Renderer(this.gl);

        await this.dataLoader.load();
        this.maps = this.dataLoader.loadAllMaps();

        if (!this.maps || this.maps.length == 0) {
            throw new Error("No map previews found!");
        }

        await this._setupCurrentMap();

        this.keydownHandler = this.keydownHandler.bind(this);
        document.addEventListener("keydown", this.keydownHandler);
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
        // If renderer, camera and light objects exist, render the current scene - this check is needed 
        // due to the asynchronous nature of the init method.
        if (this.renderer && this.camera && this.light) {
            this.renderer.render(this.scene, this.camera, this.light);
        }
    }

    /**
     * Loads the data that needs to be communicated between the previous and current state.
     * @param {Object} items - items to be loaded from the previous game state. 
     */
    async load(items) {
        // As this state is the first state, it doesn't load anything. This method must
        // exist because this class extends the GameState interface which defines it.
    }

    /**
     * Unloads data to the next game state.
     * @returns the object of items to be loaded in the next state. 
     */
    unload() {
        return {
            // The 'previews/' part must be removed from the path so that the url points at
            // the actual map, not the preview.
            selectedMapUrl: this.maps[this.currentMapIndex].url.replace("previews/", ""),
        };
    }

    /**
     * Clears all the data of the current game state.
     */
    delete() {
        SelectMapState.count = (SelectMapState.count - 1 < selectMapConstants.minInstances)
            ? selectMapConstants.minInstances : SelectMapState.count - 1;

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
     * The handler for a keydown event, which is used to swap between maps.
     * @param {Event} e - the event that occurs on keydown.
     */
    async keydownHandler(e) {
        this.timeValues.time = Date.now();
        this.timeValues.deltaTime = (this.timeValues.time - this.timeValues.startTime) * selectMapConstants.millisecondsFactor;

        switch (e.code) {
            case "KeyA":
                // Move to previous map.
                if (this.timeValues.deltaTime < selectMapConstants.throttleBound) {
                    await this._moveToNextMap(false);
                }
                break;
            case "KeyD":
                // Move to next map.
                if (this.timeValues.deltaTime < selectMapConstants.throttleBound) {
                    await this._moveToNextMap(true);
                }
                break;
            case "Enter":
                // Confirm map selection.
                this.exitCode = this.exitCodes.stateFinished;
                break;
            case "Escape":
                // Move back to start screen.
                // The function must have a timeout, otherwise the redirect fails with the
                // NS_BINDING_ABORTED flag.
                setTimeout(function () { document.location = "/index.html"; }, 500);
                return false;
        }

        this.timeValues.startTime = this.timeValues.time;
    }

    // PRIVATE METHODS

    /**
     * Sets up the map pointed to by the currentMapIndex.
     * @private
     */
    async _setupCurrentMap() {
        await this.gltfLoader.load("/" + this.maps[this.currentMapIndex].url);
        this.scene = await this.gltfLoader.loadScene(this.gltfLoader.defaultScene);
        this.camera = await this.gltfLoader.loadNode("Camera");
        let lightPosition = await this.gltfLoader.loadNode("Light");
        this._setLight(lightPosition);

        if (!this.scene || !this.camera || !this.light) {
            throw new Error("Scene, Camera or Light not present in glTF!");
        }
        if (!this.camera.camera) {
            throw new Error("Camera node does not contain a camera reference!");
        }

        this.renderer.prepareScene(this.scene);
    }

    /**
     * Sets the position of the Light node and adds it to the scene.
     * @param {Object} lightPosition - the position to which the light will be set.
     * @private
     */
    _setLight(lightPosition) {
        let lTranslation = vec3.create();
        mat4.getTranslation(lTranslation, lightPosition.matrix);

        this.light = new Light();

        this.light.position[0] = lTranslation[0];
        this.light.position[1] = lTranslation[1];
        this.light.position[2] = lTranslation[2];

        this.scene.addNode(this.light);
    }

    /**
     * Switches the current map to the next/previous.
     * @param {Boolean} next - flag that signifies if we're moving to the next or previous map. 
     * @private
     */
    async _moveToNextMap(next) {
        if (next) {
            this.currentMapIndex = (this.currentMapIndex + 1 > this.maps.length - 1) ?
                0 : this.currentMapIndex + 1;
        }
        else {
            this.currentMapIndex = (this.currentMapIndex - 1 < 0) ?
                this.maps.length - 1 : this.currentMapIndex - 1;
        }

        await this._setupCurrentMap();
    }

}

// The class count is needed to ensure only one of such class is created,
// thus making it a singleton. This is because the game can exist in only 
// one such state at a time.
SelectMapState.count = 0;

const selectMapConstants = {
    minInstances: 0,
    maxInstances: 1,
    previewsPath: "/data/maps/map-previews.json",
    millisecondsFactor: 0.001,
    throttleBound: 2,
};
Object.freeze(selectMapConstants);