import { Tank } from "../../components/tank/Tank.js";
import { Loader } from "./Loader.js";

/**
 * @class TankLoader - loads properties of tanks from JSON files.
 */
export class TankLoader extends Loader {

    /**
     * Constructs a new TankLoader object.
     */
    constructor() {
        super();
    }

    /**
     * Creates a Tank object from the JSON object of the given name.
     * @param {String} name - the name of the tank. 
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

    /**
     * Returns a list of all Tank objects in the game.
     * @returns a list of all Tank objects.
     */
    getAllTanks() {
        let items = new Array();
        for (let item in this.json) {
            if (item[0] !== "_") {
                items.push(new Tank(item, this.json[item]));
            }
        }
        return items;
    }

}