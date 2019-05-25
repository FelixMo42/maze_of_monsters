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
    name: "Foor Solder",
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
    name: "Felix Moses",
    image: "felix.jpg",
    controller: "player",
    actions: [
        ...baseActions,
        actions.slice,
        actions.shoot,
        actions.firebolt
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