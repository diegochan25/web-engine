# WebEngine

A web-based game engine designed for the creation of legacy-style videogames playable in the browser.

## Scope

### Target game types

Simple single-player 2.5D and 3D games with a focus on performance, responsiveness, and deterministic simulation.

### Target audience

JavaScript and game developers interested in building simple, performant videogames using intuitive and predictable engine APIs.

### API Style

The engine will expose a focused, engine-style API centered on core systems and runtime behavior. Higher-level UIs, frameworks, and editor tooling may be layered on top in separate projects.

## Platform & Constraints

### Runtime environment 

Modern browsers

Web Workers for background and parallelizable systems

### Rendering target

WebGL as the primary rendering backend

Future support for WebGPU when it becomes widely available and stable.

### Performance targets

The engine aims to achieve stable 30 FPS performance on most supported hardware [[1]](#1). 

### Platform targets

Desktop support via frameworks such as [Tauri](https://v2.tauri.app) or [Electron](https://www.electronjs.org) is is under evaluation.

Mobile support is is under evaluation.

## Engine Architecture

### Programming Model

A hybrid approach combining object-oriented design for high-level behavior and usability and Entity-Component-System patterns for performance-critical systems allows flexibility while enabling data-oriented optimizations where needed.

### Game loop

The engine will use a fixed timestep simulation model:

- Deterministic update cycle

- Decoupled rendering when possible

- Configurable simulation frequency

This approach ensures stability in physics, predictable gameplay, and easier debugging.

### World Management

**Scene**
A scene is a structured collection of entities, systems, and behaviors represented as serializable data. Scenes can be authored as pure data and constructed through a scene builder.

**Scene Groups**

A scene group consists of:

- A base scene

- Variant scenes

- State and transition logic

Scene groups represent dynamic environments that change based on world state or user actions.

**World**

A world is a high-level container responsible for:

- Managing scene groups

- Tracking player state

- Handling transitions

- Persisting long-term progress

A world manager orchestrates loading, unloading, and synchronization of scene groups according to game state.
 
## Rendering system


## Input system


## Audio system


## Save data


## Configuration


## Scripting


## Public API


## Tooling

**UIs & Editor:** will not be included in the current project. Separate projects may be created in the future to include these features.

## Build System


## Tests

Testing for the game engine will include two strategies:

**Automated Tests**: For internal modules & APIs.

**Sample Game**: For modules that require real-time simulation, a separate project, called [EntityRails](https://github.com/diegochan25/entity-rails.git) is being developed in parallel to the engine. 

## Notes

### 1

Performance guarantees not yet rated.