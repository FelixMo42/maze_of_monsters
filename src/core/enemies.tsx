import { Character } from "./characters"

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
