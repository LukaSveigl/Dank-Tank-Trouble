# ES6/WebGL 2.0 Game
This project is based on ES6/WebGL 2.0 based video game for a CS Undergraduate course in computer graphics. 
The game was created by Peter Savnik (graphics designer), Luka Šveigl (main developer) and Nejc Vrčon Zupan (team lead and playtester), 
and it's developement is continued by Peter Savnik and Luka Šveigl.

# Gameplay
Dank tank trouble is a 3rd person vehicle shooter, featuring multiple different tanks, enemy types and terrains in which 
the battles are fought. It is controlled by using a mouse and WASD keys.

# Building and running
The code does not need to be built, but requires a server
capable of serving static files (WebGL+CORS restrictions). A basic Node.js
implementation is available in `bin/server.js`.

# Project structure
The project is structured as follows:

- The root directory contains `index.html`, the project's front page that
  is used for showcasing code.
- The `lib` directory holds the libraries used in the project.
- The `common` directory contains all the code and resources that are used
  in multiple systems of this project.
  - The `engine` directory contains all elements that interact directly with 
    WebGL, GLTF or simulate physics.
  - The `gltf_components` directory contains implementations of all GLTF 
    components, which are used in the project. They are mainly needed in
    the GLTFLoader implementation.
  - The `images` directory contains images that are used to draw HUDs.
  - The `models` directory contains GLTF files and all other files that
    represent 3D models.
  - The `sounds` directory contains sounds used in the Sound Manager implementation.  
- The `src` directory contains all the code that provides the functionality of 
  the program.
  - The `DEBUG` directory contains code that was used to debug certain parts of
    code. It mainly contains different sliders and menu options and instructions
    for how to include them in your code.
  - The `entities` directory contains implementations of player and enemies.
  - The `game` directory contains the implementation of the main Game class.
  - The `game_components` directory contains implementations of specific
    game components, such as select screen, or actual game.
  - The `managers` directory contains implementations of entity manager, sound
    manager and menu manager.
  - The `menus` directory contains implementations of a basic menu and all other
    HUD displays.
  - The `shaders` directory contains implementations of shaders.

# Used technologies
This project is written in ES6, and uses the graphical library WebGL. The menus are created with
DatGUI, and all 3D math is done using the gl-Matrix library.