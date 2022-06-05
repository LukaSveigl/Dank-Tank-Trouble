/**
 * The application's main entry point.
 */

import { Game } from "./game/Game.js";

/** The game object. */
let game = null;

/** 
 * When the window is loaded, the game is created and the game loop is started.
 */
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas");
    game = new Game(canvas);
});
