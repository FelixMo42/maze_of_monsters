import Game from './game/Game'

import actions from './game/data/actions'
import items from './game/data/items'


let App = () => {
    return "mode invalid"
}

let mode = "test"

if (mode === "game") {
  //  App = Game
}

if (mode === "test") {
    async function test() {
        await actions.load(0)
    
        console.log(actions[0])
    }
    test()

    App = () => "test mode"
}

export default App 