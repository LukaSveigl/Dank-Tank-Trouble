import { GameState } from "./GameState.js";

//import { Renderer } from "../../common/engine/graphics/Renderer.js"
//import { GLTFLoader } from "../../common/engine/gltf-loader/GLTFLoader.js"

/**
 * @class SelectTankState - game state that implements the selection of the player tank.
 */
export class SelectTankState extends GameState {

    /**
     * Constructs a new SelectMapState object.
     * @param {Object} gl - the WebGL object. 
     */
    constructor(gl) {
        super(gl);

        this.loadedItems = {
            selectedMapUrl: null,
            selectedTankUrl: null,
        };

        this.dataLoader = null;

        this.currentTankIndex = 0;

        this.timeValues = {
            time: Date.now(),
            startTime: Date.now(),
            deltaTime: 0,
        };

        SelectTankState.count++;
        if (SelectTankState.count > selectTankConstants.maxInstances) {
            SelectTankState.count--;
            throw new Error("Only one instance of SelectTankState can be active at a time!");
        }
    }

    /**
     * Initializes the state after it has been created.
     */
    async init() {
        this.dataLoader = new DataLoader(null, selectTankConstants.previewsPath);
        this.gltfLoader = new GLTFLoader();
        this.renderer = new Renderer(this.gl);

        await this.dataLoader.load();
        this.tanks = this.dataLoader.loadAllTanks();

        if (!this.tanks || this.tanks.length == 0) {
            throw new Error("No map previews found!");
        }

        await this._setupCurrentTank();

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
        this.loadedItems.selectedMapUrl = items.selectedMapUrl;
    }

    /**
     * Unloads data to the next game state.
     * @returns the object of items to be loaded in the next state. 
     */
    unload() {
        this.loadedItems.selectedTankUrl = this.tanks[this.currentTankIndex].url;
        return this.loadedItems;
    }

    /**
     * Clears all the data of the current game state.
     */
    delete() {
        SelectTankState.count = (SelectTankState.count - 1 < selectTankConstants.minInstances)
            ? selectTankConstants.minInstances : SelectTankState.count - 1;

        if (this.gl) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl = null;
        }

        this.scene = null;
        this.camera = null;
        this.light = null;

        this.gltfLoader = null;

        this.renderer = null;

        document.removeEventListener("keydown", this.keydownHandler);
    }

    /**
     * The handler for a keydown event, which is used to swap between maps.
     * @param {Event} e - the event that occurs on keydown.
     */
    async keydownHandler(e) {
        this.timeValues.time = Date.now();
        this.timeValues.deltaTime = (this.timeValues.time - this.timeValues.startTime) * selectTankConstants.millisecondsFactor;

        switch (e.code) {
            case "KeyA":
                // Move to previous map.
                if (this.timeValues.deltaTime < selectTankConstants.throttleBound) {
                    await this._moveToNextTank(false);
                }
                break;
            case "KeyD":
                // Move to next map.
                if (this.timeValues.deltaTime < selectTankConstants.throttleBound) {
                    await this._moveToNextTank(true);
                }
                break;
            case "Enter":
                // Confirm map selection.
                this.exitCode = this.exitCodes.stateFinished;
                break;
            case "Escape":
                // Move back to start screen.
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
    async _setupCurrentTank() {
        await this.gltfLoader.load("/" + this.tanks[this.currentTankIndex].url);
        this.scene = await this.gltfLoader.loadScene(this.gltfLoader.defaultScene);
        this.camera = await this.gltfLoader.loadNode("Camera");
        let lightPosition = await this.gltfLoader.loadNode("Light");
        this._setLight(lightPosition);

        if (!this.scene || !this.camera) {
            throw new Error("Scene or Camera not present in glTF!");
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
    async _moveToNextTank(next) {
        if (next) {
            this.currentTankIndex = (this.currentTankIndex + 1 > this.tanks.length - 1) ?
                0 : this.currentTankIndex + 1;
        }
        else {
            this.currentTankIndex = (this.currentTankIndex - 1 < 0) ?
                this.tanks.length - 1 : this.currentTankIndex - 1;
        }

        await this._setupCurrentTank();
    }

}

// The class count is needed to ensure only one of such class is created,
// thus making it a singleton. This is because the game can exist in only 
// one such state at a time.
SelectTankState.count = 0;

const selectTankConstants = {
    minInstances: 0,
    maxInstances: 1,
    previewsPath: "/data/tanks/tank-properties.json",
    millisecondsFactor: 0.001,
    throttleBound: 2,
};
Object.freeze(selectTankConstants);