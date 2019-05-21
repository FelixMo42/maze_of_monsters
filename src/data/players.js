import actions from "./actions"
import skills from "./skills"
import items from "./items"

var baseAiContoller = {}

/// lists ///

const baseSkills = [
    skills.dodge,
    skills.defence
]

const baseActions = [
    actions.punch,
    actions.move,
    actions.pickup,
]

/// enemies ///

const solder = {
    name: "foor solder",
    color: "gray",
    image: "white.png",
    controller: baseAiContoller,
    actions: [
        ...baseActions
    ],
    skills: [
        ...baseSkills
    ]
}

/// player characters ///

const edenBlack = {
    name: "Eden Black",
    color: "black",
    image: "white.png",
    controller: "player",
    actions: [
        ...baseActions,
        actions.slice,
        actions.shoot
    ],
    equiped: [
        items.sword,
        items.gun
    ],
    items: [
        
    ],
    maxMoves: {
        main: 7
    },
    skills: [
        ...baseSkills
    ]
}

/// export ///

export default {
    solder,
    edenBlack
}