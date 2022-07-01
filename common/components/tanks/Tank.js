/**
 * @class Tank - represents a tank in game, with all its components, stats, etc.
 */
export class Tank {

    /**
     * Constructs a new Tank object.
     * @param {String} name - name of the tank.
     * @param {Object} options - the properties of the tank (in JSON form).
     */
    constructor(name, options) {
        if (name === undefined || options === undefined) {
            throw new Error("Tank name, options are required.");
        }

        if (options.url === undefined) {
            throw new Error("Tank data must be linked to a tank gltf file!");
        }

        this.name = name;
        this.url = options.url;

        this.models = {
            top: null,
            bottom: null,
        };

        this.properties = {
            maxHealth: options.maxHealth === undefined ? tankConstants.defaultHealth : options.maxHealth,
            velocity: options.velocity === undefined ? tankConstants.defaultVelocity : options.velocity,
            damage: options.damage === undefined ? tankConstants.defaultDamage : options.damage,
        };
    }

    /**
     * Sets the model of the tank.
     * @param {Object} top - the model of the top of the tank.
     * @param {Object} bottom - the model of the bottom of the tank.
     */
    setModels(top, bottom) {
        this.models.top = top;
        this.models.bottom = bottom;
    }

}

const tankConstants = {
    defaultHealth: 100,
    defaultVelocity: 1,
    defaultDamage: 10,
};

Object.freeze(tankConstants);