/**
 * @class Map - represents a map, which is the environment in which the game is played.
 */
export class Map {

    /**
     * Constructs a new Map object.
     * @param {String} name - name of the map. 
     * @param {Object} options - the properties of the map (in JSON form).
     */
    constructor(name, options) {
        if (name === undefined || options === undefined) {
            throw new Error("Map name, options are required.");
        }

        if (options.url === undefined) {
            throw new Error("Map data must be linked to a map gltf file!");
        }

        this.name = name;
        this.scene = null;
        this.url = options.url;

        this.properties = {
            lightPosition: options.lightPosition === undefined ?
                mapConstants.defaultLightPosition : options.lightPosition,
            cameraPosition: options.cameraPosition === undefined ?
                mapConstants.defaultCameraPosition : options.cameraPosition,
        };
    }

    /**
     * Sets the scene of the map.
     * @param {Object} scene - the scene of the map. 
     */
    setScene(scene) {
        this.scene = scene;
    }

}

const mapConstants = {
    defaultLightPosition: [0, 0, 0],
    defaultCameraPosition: [0, 0, 0],
};

Object.freeze(mapConstants);