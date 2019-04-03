import Game from './game/Game'
//import React from "react"

let App = () => {
    return "mode invalid"
}

let mode = "game"

if (mode === "game") {
    App = Game
}

if (mode === "pathfinder") {
    App = class AppClass extends Game {
        createWorld() {
            var state = {}

            state.world = new Map({})

            return state
        }
    }
}

export default App 