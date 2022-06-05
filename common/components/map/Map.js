/**
 * @class Map - represents a map, which is the environment in which the game is played.
 */
export class Map {

    /**
     * Constructs a new Map object.
     * @param {string} name - name of the map. 
     * @param {Object} options - the properties of the map (in JSON form).
     */
    constructor(name, options) {
        if (name === undefined || options === undefined) {
            throw new Error("Map name, scene and options are required.");
        }

        this.name = name;
        this.scene = null;

        this.properties = {
            lightPosition: options.lightPosition === undefined ? [0, 0, 0] : options.lightPosition,
            cameraPosition: options.cameraPosition === undefined ? [0, 0, 0] : options.cameraPosition,
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