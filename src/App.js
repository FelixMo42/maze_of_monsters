import Game from './game/Game'
import Editor from './editor/Editor'

let App = () => {
    return "mode invalid"
}

let mode = "game"

if (mode === "game") {
    App = Game
}

if (mode === "editor") {
    App = Editor
}

export default App 