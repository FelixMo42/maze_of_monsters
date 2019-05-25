import ActionRef from "../game/action/ActionRef"
import { RandomValue } from "../game/util/Value"
import skills from "./skills";

/// base actions ///

const move = {
    name: "Move",
    requirments: {
        walkable: true
    },
    effects: [
        {
            style: "self",
            playerEffect: {
                pull: 1
            }
        }
    ],
    cost: {
        moves: {
            main: -1
        }
    }
}

const punch = {
    name: "Punch",
    effects: [
        {
            aim: new ActionRef.playerSkillRoll(skills.handtohand),
            playerEffect: {
                damage: new RandomValue(-20, -10)
            }
        }
    ],
    cost: {
        moves: {
            main: -5
        }
    }
}

const pickup = {
    name: "Pick Up",
    effects: [
        {
            itemEffect: {
                pickup: true
            }
        }
    ],
    cost: {
        moves: {
            main: -2
        }
    }
}

/// ////

const firebolt = {
    name: "Fire Bolt",
    range: 200,
    cost: {
        MP: 10
    }
}

/// item actions ///

const slice = {
    name: "Slice",
    itemTypes: ["sword"],
    range: new ActionRef.item("range"),
    effects: [
        {
            aim: new ActionRef.playerSkillRoll(skills.swordsmanship),
            playerEffect: {
                damage: new RandomValue(-100, -50)
            }
        }
    ],
    cost: {
        moves: {
            main: -5
        }
    }
}

const shoot = {
    name: "Shoot",
    itemTypes: ["gun"],
    range: new ActionRef.item("range"),
    effects: [
        {
            aim: new ActionRef.playerSkillRoll(skills.gunsmanship),
            playerEffect: {
                damage: new RandomValue(-50, -25)
            }
        }
    ],
    cost: {
        moves: {
            main: -3
        }
    }
}

/// export them ///

export default {
    move,
    punch,
    pickup,
    slice,
    shoot,
    firebolt
}