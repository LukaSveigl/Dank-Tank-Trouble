/**
 * @class GameState - an "abstract" class providing an interface for all game states.
 */
export class GameState {

    /**
     * Constructs a new GameState object.
     * @param {Object} gl - the WebGL object.
     */
    constructor(gl) {
        // Because every game state works with WebGL, it needs
        // a WebGL object, a scene, camera, light, a renderer and a GLTF loader. 
        this.gl = gl;

        this.scene = null;
        this.camera = null;
        this.light = null;

        this.gltfLoader = null;

        this.renderer = null;

        this.exitCodes = {
            normalOperation: 0,
            stateFinished: 1,
        };
        Object.freeze(this.exitCodes);

        this.exitCode = this.exitCodes.normalOperation;

        // This is needed to ensure that children of this class implement all 
        // of the defined methods.
        const proto = Object.getPrototypeOf(this);
        const superProto = GameState.prototype;
        const missing = Object.getOwnPropertyNames(superProto).find(name =>
            typeof superProto[name] === "function" && !proto.hasOwnProperty(name)
        );
        if (missing) throw new TypeError(`${this.constructor.name} needs to implement ${missing}.`);
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

}

/*
 * This class cannot be a singleton, because the states are created in advance,
 * so they can load and unload data to eachother when needed.
 */
//GameState.stateCount = 0;