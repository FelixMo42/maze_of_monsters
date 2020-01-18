import React from "react"
import Game from "./game/Game"
import Map from "./game/map/Map"
import Player from "./game/player/Player"
import actions from "./game/action/actions"
import Vec2 from "./game/util/Vec2"

let move = actions.register({
    name: "Move",
    id: 0,

    "effects": [
        {
            "type" : "push",

            "roll" : {"type": "inherit"},
            "style" : {"type":"inherit"},
            "subEffects" : []
        }
    ]
})

export default () => (<Game world={async () => {
    let mc = new Player({
        name: "Felix",
        image: "felix.jpg",
        controller: "player",

        actions: [move]
    })

    let world = new Map({
    })

    world.setPlayer(mc, new Vec2(1,1))

    return {
        map: world,
        players: [ mc ]
    }
}} />)