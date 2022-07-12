import { GameState } from "./GameState.js";

import { DataLoader } from "../../common/engine/data-loader/DataLoader.js";

import { Renderer } from "../../common/engine/graphics/Renderer.js"
import { GLTFLoader } from "../../common/engine/gltf-loader/GLTFLoader.js"

import { Light } from "../../common/engine/gltf-loader/gltf-components/Light.js";

import { vec3, mat4, quat } from "../../lib/gl-matrix-module.js";

/**
 * @class SelectTankState - game state that implements the selection of the player tank.
 */
export class SelectTankState extends GameState {

    /**
     * Constructs a new SelectTankState object.
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
        this.alreadyRendered = false;
        this.currentRotation = 0.005;

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

        await this.gltfLoader.load("../../common/assets/models/floor/floor.gltf");
        this.floor = await this.gltfLoader.loadNode("ground");

        await this.dataLoader.load();
        this.tanks = this.dataLoader.loadAllTanks();

        if (!this.tanks || this.tanks.length == 0) {
            throw new Error("No tank previews found!");
        }

        await this._setupCurrentTank();

        this.keydownHandler = this.keydownHandler.bind(this);
    }

    /**
     * Updates the state of everything in the current game state.
     * @param {Number} dt - delta time. The time difference since the last update.
     * @returns {Number} the exit code, which is needed to signal the end of the state.
     */
    update(dt) {
        this._rotate();
        return this.exitCode;
    }

    /**
     * Renders the game state scene.
     */
    render() {
        // If renderer, camera and light objects exist, render the current scene - this is needed due
        // to the asynchronous nature of the init method.
        if (this.renderer && this.camera && this.light) {
            this.renderer.render(this.scene, this.camera, this.light);
            this.alreadyRendered = true;
        }
    }

    /**
     * Loads the data that needs to be communicated between the previous and current state.
     * @param {Object} items - items to be loaded from the previous game state. 
     */
    async load(items) {
        if (!items.selectedMapUrl) {
            throw new Error("Previous state hasn't unloaded the correct data.");
        }
        this.loadedItems.selectedMapUrl = items.selectedMapUrl;
        // As this is not the first state, the event listener must be added during
        // loading, to prevent a key pressed in the previous state to register in 
        // this state too.
        document.addEventListener("keydown", this.keydownHandler);
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
        this.dataLoader = null;

        this.renderer = null;

        document.removeEventListener("keydown", this.keydownHandler);
    }

    /**
     * The handler for a keydown event, which is used to swap between tanks.
     * @param {Event} e - the event that occurs on keydown.
     */
    async keydownHandler(e) {
        this.timeValues.time = Date.now();
        this.timeValues.deltaTime = (this.timeValues.time - this.timeValues.startTime) * selectTankConstants.millisecondsFactor;

        switch (e.code) {
            case "KeyA":
                // Move to previous tank.
                if (this.timeValues.deltaTime < selectTankConstants.throttleBound) {
                    await this._moveToNextTank(false);
                }
                break;
            case "KeyD":
                // Move to next tank.
                if (this.timeValues.deltaTime < selectTankConstants.throttleBound) {
                    await this._moveToNextTank(true);
                }
                break;
            case "Enter":
                // Confirm tank selection.

                // This check is needed so the keypress of Enter from the
                // previous state is not registered here, as it should only be allowed once the 
                // scene has been rendered.
                if (this.alreadyRendered) {
                    this.exitCode = this.exitCodes.stateFinished;
                }
                break;
            case "Escape":
                // Move back to start screen, but prompt the user first.
                if (confirm("Are you sure you want to leave the game?")) {
                    // The function must have a timeout, otherwise the redirect fails with the
                    // NS_BINDING_ABORTED flag.
                    setTimeout(function () { document.location = "/index.html"; }, 500);
                    return false;
                }
        }

        this.timeValues.startTime = this.timeValues.time;
    }

    // PRIVATE METHODS

    /**
     * Sets up the tank pointed to by the currentTankIndex.
     * @private
     */
    async _setupCurrentTank() {
        await this.gltfLoader.load("/" + this.tanks[this.currentTankIndex].url);
        this.scene = await this.gltfLoader.loadScene(this.gltfLoader.defaultScene);
        this.camera = await this.gltfLoader.loadNode("Camera");
        this._setLight(selectTankConstants.lightStartPosition);
        this._setCamera(selectTankConstants.cameraStartPosition, selectTankConstants.cameraAngle);

        if (!this.tanks[this.currentTankIndex].models.top) {
            const tankTopName = this.tanks[this.currentTankIndex].modelNames.topName;
            this.tanks[this.currentTankIndex].models.top = await this.gltfLoader.loadNode(tankTopName);
        }
        if (!this.tanks[this.currentTankIndex].models.bot) {
            const tankBotName = this.tanks[this.currentTankIndex].modelNames.botName;
            this.tanks[this.currentTankIndex].models.bot = await this.gltfLoader.loadNode(tankBotName);
            this.tanks[this.currentTankIndex].models.bot.addChild(this.tanks[this.currentTankIndex].models.top);
        }

        if (!this.scene || !this.camera) {
            throw new Error("Scene or Camera not present in glTF!");
        }
        if (!this.camera.camera) {
            throw new Error("Camera node does not contain a camera reference!");
        }

        this.scene.addNode(this.floor);

        this.renderer.prepareScene(this.scene);
    }

    /**
     * Sets the position of the Light node and adds it to the scene.
     * @param {Object} lightPosition - the position to which the light will be set.
     * @private
     */
    _setLight(lightPosition) {
        this.light = new Light();
        this.scene.addNode(this.light);
        this.light.position = lightPosition;
    }

    /**
     * Sets the position and viewing angle of the camera.
     * @param {Array} cameraPosition - the camera's starting position.
     * @param {Number} cameraAngle - the camera's viewing angle. 
     */
    _setCamera(cameraPosition, cameraAngle) {
        this.camera.updateTransform();

        mat4.fromTranslation(this.camera.matrix, cameraPosition);
        this.camera.updateTransform();

        quat.rotateX(this.camera.rotation, this.camera.rotation, cameraAngle);
        this.camera.updateMatrix();
    }

    /**
     * Switches the current tank to the next/previous.
     * @param {Boolean} next - flag that signifies if we're moving to the next or previous tank. 
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

    /**
     * Orbits the camera around the tank.
     * @private
     */
    _rotate() {
        if (this.camera && this.tanks[this.currentTankIndex].models.bot) {
            // The camera must be rotated upwards so the rotation around the center does not
            // make it orbit at an angle.
            quat.rotateX(this.camera.rotation, this.camera.rotation, -selectTankConstants.cameraAngle);
            vec3.rotateY(
                this.camera.translation,
                this.camera.translation,
                this.floor.translation,
                0.005
            );
            quat.rotateY(this.camera.rotation, this.camera.rotation, 0.005);
            // Because the camera's angle was adjusted to account for the orbit,
            // the angle must be corrected back to the viewing angle.
            quat.rotateX(this.camera.rotation, this.camera.rotation, selectTankConstants.cameraAngle);
            this.camera.updateMatrix();
        }
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
    lightStartPosition: [-53, 90, 33],
    cameraStartPosition: [0, 4.6, 16.85],
    cameraAngle: -0.14,
    rotationIncrement: 0.005,
    rotationLimit: 6.25,
};
Object.freeze(selectTankConstants);