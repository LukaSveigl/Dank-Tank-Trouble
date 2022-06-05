import { MapLoader } from "./MapLoader";
import { TankLoader } from "./TankLoader";

/**
 * @class DataLoader - class that encapsulates the loading of game components.
 */
export class DataLoader {

    /**
     * Constructs a new DataLoader object.
     * @param {string} mapUrl - the URL of the JSON file of all maps.
     * @param {string} tankUrl - the URL of the JSON file of all tanks.
     */
    constructor(mapUrl, tankUrl) {
        if (mapUrl === undefined || tankUrl === undefined) {
            throw new Error("Map and tank URLs are required.");
        }

        this.mapLoader = new MapLoader().load(mapUrl);
        this.tankLoader = new TankLoader().load(tankUrl);
    }

    /**
     * Loads the map with the given name.
     * @param {string} name - the name of the map.
     * @returns the Map object of the given name.
     */
    loadMap(name) {
        return this.mapLoader.getMap(name);
    }

    /**
     * Loads the tank with the given name.
     * @param {string} name - the name of the tank.
     * @returns the Tank object of the given name.
     */
    loadTank(name) {
        return this.tankLoader.getTank(name);
    }

}