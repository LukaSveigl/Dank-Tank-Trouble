import { MapLoader } from "./MapLoader.js";
import { TankLoader } from "./TankLoader.js";

/**
 * @class DataLoader - class that encapsulates the loading of game components.
 */
export class DataLoader {

    /**
     * Constructs a new DataLoader object.
     * @param {String} mapUrl - the URL of the JSON file of all maps.
     * @param {String} tankUrl - the URL of the JSON file of all tanks.
     */
    constructor(mapUrl, tankUrl) {
        if (mapUrl === undefined || tankUrl === undefined) {
            throw new Error("Map and tank URLs are required.");
        }

        this.mapLoader = new MapLoader();
        this.tankLoader = new TankLoader();

        this.mapUrl = mapUrl;
        this.tankUrl = tankUrl;
    }

    /**
     * Asynchronously loads the JSON files to their respective loaders. 
     */
    async load() {
        if (this.mapUrl !== null) {
            await this.mapLoader.load(this.mapUrl);
        }
        if (this.tankUrl !== null) {
            await this.tankLoader.load(this.tankUrl);
        }
    }

    /**
     * Loads the map with the given name.
     * @param {String} name - the name of the map.
     * @returns the Map object of the given name.
     */
    loadMap(name) {
        return this.mapLoader.getMap(name);
    }

    /**
     * Loads the tank with the given name.
     * @param {String} name - the name of the tank.
     * @returns the Tank object of the given name.
     */
    loadTank(name) {
        return this.tankLoader.getTank(name);
    }

    /**
     * Returns a list of all Map objects.
     * @returns a list of all Map objects.
     */
    loadAllMaps() {
        return this.mapLoader.getAllMaps();
    }

    /**
     * Returns a list of all Tank objects.
     * @returns a list of all Tank objects.
     */
    loadAllTanks() {
        return this.tankLoader.getAllTanks();
    }

}