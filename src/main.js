/**
 * The application's main entry point.
 */

//import { Game } from "./game/Game.js";
import { DataLoader } from "../common/engine/data-loader/DataLoader.js";
import { SelectMapState } from "./game-states/SelectMapState.js";
import { SelectTankState } from "./game-states/SelectTankState.js";

/** The game object. */
let game = null;

async function testLoad() {
    let dataLoader = new DataLoader("../../data/maps/map-properties.json", "../../data/tanks/tank-properties.json");
    await dataLoader.load();
    let map = dataLoader.loadMap("simpleTown");
    let tank = dataLoader.loadTank("Little Willie");
    console.log(map);
    console.log(tank);

    return [map, tank];
}

/**
 * All tests for underlying non-graphical functionality of this project, such as 
 * loading data, error checks etc. Everything else must be tested manually.
 */
function tests() {
    // TEST 1: LOADER TEST
    //
    // Test if JSON loaders work properly. This test is pointless, as
    // the result will always be undefined until the end of the function
    // due to it's async nature.
    console.log("Starting json load test...");
    {
        let res = testLoad();
        if (res[0] == undefined) {
            console.log('%c Map cannot be undefined.', 'color: red');
        }
        else {
            console.log('%c Map loading successful.', 'color: green');
        }

        if (res[1] == undefined) {
            console.log('%c Tank cannot be undefined.', 'color: red');
        }
        else {
            console.log('%c Tank loading successful.', 'color: green');
        }
    }
    console.log("Json load test finished.");

    // TEST 2: STATE TEST
    //
    // Test if creation and deletion of states throws errors at the appropriate
    // conditions.
    console.log("Starting state test...");

    // Test 2.1: No error supposed to be thrown.
    {
        let errorFound = false;
        try {
            let sms1 = new SelectMapState(null);
            let sts1 = new SelectTankState(null);
            sts1.delete();
            let sts2 = new SelectTankState(null);
        } catch (error) {
            // This check is needed to skip the undefined method error.
            if (!(error instanceof TypeError)) {
                errorFound = true;
                console.log('%c SelectTankState is deleted - shouldn\'t throw error. ' + error, 'color: red');
            }
        }
        if (!errorFound) {
            console.log('%c No errors thrown.', 'color: green');
        }
    }

    // Test 2.2: Error supposed to be thrown.
    {
        let errorFound = false;
        try {
            let sms1 = new SelectMapState(null);
            let sts1 = new SelectTankState(null);
            let sts2 = new SelectTankState(null);
        } catch (error) {
            if (!(error instanceof TypeError)) {
                errorFound = true;
                console.log('%c SelectTankState isn\'t deleted - error is thrown. ' + error, 'color: green');
            }
        }
        if (!errorFound) {
            console.log('%c No errors thrown.', 'color: red');
        }
    }
    console.log("State test finished.");

    console.log("Tests finished!");
}


/** 
 * When the window is loaded, the game is created and the game loop is started.
 */
document.addEventListener("DOMContentLoaded", () => {
    tests();

    /* Uncomment to run the game.
    const canvas = document.querySelector("canvas");
    game = new Game(canvas);
    */
});
