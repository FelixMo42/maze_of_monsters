import { STATE } from "../view/combat"
import { Character, fire, init } from "./characters"
import { isOutOfNewItems, items, resetItemPool } from "./items"

export abstract class Enemy extends Character {}

export class Goblin extends Enemy {
    name: string = "Goblin"
    hp: number = 100

    constructor(number: number) {
        super()

        this.name = `Goblin #${number}`
        this.hp = 100 + 10 * (number - 1)
    }
}

////////////////////
// UTIL FUNCTIONS //
////////////////////

export function declareVictory() {
    // Double check to make sure all the enemies are dead
    if (isEnemiesAlive()) return alert("You can't declare victory!")

    // Give the reward to the player
    if (!isOutOfNewItems()) {        
        resetItemPool("reward", items[STATE.value.room - 1])
    }
}

export function isEnemiesAlive() {
    // We are in combat as long at least one enemey is still alive
    return STATE.value.enemies.some(enemy => enemy.hp > 0)
}

export function kickOpenTheDoor() {
    // We are now in the next room
    STATE.value.room += 1

    // Spawn new enemies
    STATE.value.enemies = init(new Goblin(STATE.value.room))

    // Tell the world about it
    fire({ kind: "NEW_ROOM" })

    // Trigger a render update
    STATE.value = {...STATE.value}
}
