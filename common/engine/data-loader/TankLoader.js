import { Tank } from "../../components/tanks/Tank";

/**
 * @class TankLoader - loads properties of tanks from JSON files.
 */
export class TankLoader {

    /**
     * Constructs a new TankLoader object.
     */
    constructor() {
        this.json = null;
        this.jsonUrl = null;
        this.dirname = null;

        this.cache = new Map();
    }

    /**
     * Gets the JSON object of all tanks.
     * @param {string} url - the URL of the JSON file.
     * @returns the JSON object of the given url.
     */
    fetchJson(url) {
        return fetch(url)
            .then(response => response.json())
            .catch(error => console.error(error));
    }

    /**
     * Loads the JSON file of all tanks.
     * @param {string} url - the URL of the JSON file. 
     */
    async load(url) {
        this.jsonUrl = new URL(url, window.location);
        this.json = await this.fetchJson(url);
    }

    /**
     * Creates a Tank object from the JSON object of the given name.
     * @param {string} name - the name of the tank. 
     * @returns a new Tank object created from the JSON of tank with the given name.
     */
    getTank(name) {
        if (this.cache.has(name)) {
            return this.cache.get(name);
        }

        const tank = new Tank(name, this.json[name]);
        this.cache.set(name, tank);

        return tank;
    }

}