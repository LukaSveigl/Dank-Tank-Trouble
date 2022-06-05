import { Map } from "../../components/map/Map";

/**
 * @class MapLoader - loads properties of maps from JSON files.
 */
export class MapLoader {

    /**
     * Constructs a new MapLoader object.
     */
    constructor() {
        this.json = null;
        this.jsonUrl = null;
        this.dirname = null;

        this.cache = new Map();
    }

    /**
     * Gets the JSON object of all maps.
     * @param {string} url - the URL of the JSON file. 
     * @returns the JSON object of the given url.
     */
    fetchJson(url) {
        return fetch(url)
            .then(response => response.json())
            .catch(error => console.error(error));
    }

    /**
     * Loads the JSON file of all maps.
     * @param {string} url - the URL of the JSON file. 
     */
    async load(url) {
        this.jsonUrl = new URL(url, window.location);
        this.json = await this.fetchJson(url);
    }

    /**
     * Creates a Map object from the JSON object of the given name.
     * @param {string} name - the name of the map.
     * @returns a new Map object created from the JSON of map with the given name.
     */
    getMap(name) {
        if (this.cache.has(name)) {
            return this.cache.get(name);
        }

        const map = new Map(name, this.json[name]);
        this.cache.set(name, map);

        return map;
    }

}