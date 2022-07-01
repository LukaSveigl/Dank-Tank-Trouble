import { Map } from "../../components/map/Map.js";
import { Loader } from "./Loader.js";

/**
 * @class MapLoader - loads properties of maps from JSON files.
 */
export class MapLoader extends Loader {

    /**
     * Constructs a new MapLoader object.
     */
    constructor() {
        super();
    }

    /**
     * Creates a Map object from the JSON object of the given name.
     * @param {String} name - the name of the map.
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