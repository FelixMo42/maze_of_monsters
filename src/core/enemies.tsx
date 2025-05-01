import { STATE } from "../view/combat"
import { Character, init } from "./characters"

export abstract class Enemy extends Character {}

export class Goblin extends Enemy {
    name: string = "goblin"
    hp: number = 100

    constructor(number: number) {
        super()

        this.name = `goblin #${number}`
        this.hp = 100 + 10 * (number - 1)
    }
}

export function kickOpenTheDoor() {
    STATE.value.room += 1
    STATE.value.enemies = init(new Goblin(STATE.value.room))
    STATE.value = {...STATE.value}
}
