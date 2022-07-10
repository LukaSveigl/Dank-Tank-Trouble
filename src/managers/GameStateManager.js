import { SelectMapState } from "../game-states/SelectMapState.js";
import { SelectTankState } from "../game-states/SelectTankState.js";
import { RunningGameState } from "../game-states/RunningGameState.js";

/**
 * @class GameStateManager - manages everything pertaining to game states, including creation,
 *                           swapping, loading/unloading, etc.
 */
export class GameStateManager {

    /**
     * Constructs a new GameStateManager object.
     */
    constructor() {
        this.stateEnum = {
            selectMap: 0,
            selectTank: 1,
            runningGame: 2,
        }
        Object.freeze(this.states);

        this.states = {
            selectMap: null,
            selectTank: null,
            runningGame: null,
        }

        this.currentState = 0;
    }

    /**
     * Creates and initializes the game states.
     * @param {Object} gl - the WebGL object.
     */
    async init(gl) {
        this.states.selectMap = new SelectMapState(gl);
        this.states.selectTank = new SelectTankState(gl);
        this.states.runningGame = new RunningGameState(gl);

        await this.states.selectMap.init();
        await this.states.selectTank.init();
        await this.states.runningGame.init();
    }

    /**
     * Updates the current game state.
     * @param {Number} dt - delta time. The time difference since the last update.
     */
    update(dt) {
        let exitCode = -1;
        switch (this.currentState) {
            case this.stateEnum.selectMap:
                exitCode = this.states.selectMap.update(dt);
                break;
            case this.stateEnum.selectTank:
                exitCode = this.states.selectTank.update(dt);
                break;
            case this.stateEnum.runningGame:
                exitCode = this.states.runningGame.update(dt);
                break;
            default:
                throw new Error("Invalid game state!");
        }

        if (exitCode === 1) {
            this.swapState();
        }

        return this.currentState;
    }

    /**
     * Renders the current game state.
     */
    render() {
        switch (this.currentState) {
            case this.stateEnum.selectMap:
                this.states.selectMap.render();
                break;
            case this.stateEnum.selectTank:
                this.states.selectTank.render();
                break;
            case this.stateEnum.runningGame:
                this.states.runningGame.render();
                break;
            default:
                throw new Error("Invalid game state!");
        }
    }

    /**
     * Switches to the next game state, or loops back to the initial state when done. 
     */
    swapState() {
        this.currentState = (this.currentState + 1 >= gameStateManagerConstants.numberOfGameStates) ?
            0 : this.currentState + 1;

        // The selectMap state is skipped, because it is the first state and thus doesn't
        // load data from other states.
        switch (this.currentState) {
            case this.stateEnum.selectTank:
                this.states.selectTank.load(this.states.selectMap.unload());
                this.states.selectMap.delete();
                this.states.selectMap = null;
                break;
            case this.stateEnum.runningGame:
                this.states.runningGame.load(this.states.selectTank.unload());
                this.states.selectTank.delete();
                this.states.selectTank = null;
                break;
            default:
                break;
        }
    }

    /**
     * Deletes all states and performs cleanup of data.
     */
    delete() {
        if (this.states.selectMap) {
            this.states.selectMap.delete();
            this.states.selectMap = null;
        }
        if (this.states.selectTank) {
            this.states.selectTank.delete();
            this.states.selectTank = null;
        }
        if (this.states.runningGame) {
            this.states.runningGame.delete();
            this.states.runningGame = null;
        }
    }

}

const gameStateManagerConstants = {
    numberOfGameStates: 3,
};

Object.freeze(gameStateManagerConstants);