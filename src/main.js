/**
 * The application's entry point.
 */

//import { Game } from "./game/Game.js";
import { DataLoader } from "../common/engine/data-loader/DataLoader.js";
import { SelectMapState } from "./game-states/SelectMapState.js";
import { SelectTankState } from "./game-states/SelectTankState.js";

import { GameStateManager } from "./managers/GameStateManager.js";

/** The game object. */
let game = null;

async function testLoad() {
    let dataLoader = new DataLoader("../../data/maps/map-properties.json", "../../data/tanks/tank-properties.json");
    await dataLoader.load();
    let map = dataLoader.loadMap("simpleTown");
    let tank = dataLoader.loadTank("Little Willie");
    console.log(map);
    console.log(tank);

    console.log(dataLoader.loadAllMaps());

    return [map, tank];
}

/**
 * All tests for underlying non-graphical functionality of this project, such as 
 * loading data, error checks etc. Everything else must be tested manually.
 */
async function tests() {
    // TEST 1: LOADER TEST
    //
    // Test if JSON loaders work properly. 
    console.log("Starting json load test...");
    {
        let res = await testLoad();
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
        let sms1 = null;
        let sts1 = null;
        let sts2 = null;
        try {
            sms1 = new SelectMapState(null);
            sts1 = new SelectTankState(null);
            sts1.delete();
            sts2 = new SelectTankState(null);
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

        // cleanup
        if (sms1) {
            sms1.delete();
            sms1 = null;
        }
        if (sts1) {
            sts1.delete();
            sts1 = null;
        }
        if (sts2) {
            sts2.delete();
            sts2 = null;
        }
    }

    // Test 2.2: Error supposed to be thrown.
    {
        let errorFound = false;
        let sms1 = null;
        let sts1 = null;
        let sts2 = null;
        try {
            sms1 = new SelectMapState(null);
            sts1 = new SelectTankState(null);
            sts2 = new SelectTankState(null);
        } catch (error) {
            if (!(error instanceof TypeError)) {
                errorFound = true;
                console.log('%c SelectTankState isn\'t deleted - error is thrown. ' + error, 'color: green');
            }
        }
        if (!errorFound) {
            console.log('%c No errors thrown.', 'color: red');
        }

        // cleanup
        if (sms1) {
            sms1.delete();
            sms1 = null;
        }
        if (sts1) {
            sts1.delete();
            sts1 = null;
        }
        if (sts2) {
            sts2.delete();
            sts2 = null;
        }
    }
    console.log("State test finished.");

    // TEST 3: GameStateManager TEST
    //
    // Test if states correctly get created, deleted, correctly load data, etc.
    console.log("Starting GameStateManager test...");

    // Test 3.1: Check if basic initialization works properly.
    {
        // Test 3.1.1: Check if creation of SelectMapState works.
        let errorFound = false;
        let gsm = null;
        try {
            gsm = new GameStateManager();
            await gsm.init();
        } catch (error) {
            errorFound = true;
            console.log('%c Initialization of GameStateManager failed. ' + error, 'color: red');
        }

        if (!errorFound) {
            console.log('%c Initialization of GameStateManager successful.', 'color: green');
        }

        // Test 3.1.2: Check if initialization of maps works.
        if (gsm) {
            if (gsm.states.selectMap.maps && gsm.states.selectMap.maps.length != 0) {
                console.log('%c Maps loaded correctly in SelectMapState.', 'color: green');
            }
            else {
                console.log('%c Maps loaded incorrectly in SelectMapState.', 'color: red');
            }
        }
        else {
            console.log('%c Test 3.1.2 could not be performed due to earlier failure.', 'color: red');
        }

        // cleanup
        if (gsm) {
            gsm.delete();
            gsm = null;
        }
    }
    console.log("GameStateManager test finished.");

    console.log("Tests finished!");
}

/** 
 * When the window is loaded, the game is created and the game loop is started.
 */
document.addEventListener("DOMContentLoaded", async () => {
    await tests();

    //let tmp = new DataLoader(null, null);

    console.log("loaded");

    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape") {
            setTimeout(function () { document.location = "/index.html"; }, 500);
        }
        return false;
    });

    // Uncomment to run the game.
    /*
    const canvas = document.querySelector("canvas");
    game = new Game(canvas);
    */
    return false;
});


