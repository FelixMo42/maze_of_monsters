import { Action } from "./actions"

export type GameEvent
    = {
        kind: "END_TURN",
        action: Action,
        source: Character,
        target: Character,
    } | {
        kind: "NEW_ROOM"
    }

const chars: Character[] = []

export function fire(event: GameEvent) {
    for (const c of chars) {
        c.on(event)
    }
}

export abstract class Character {
    abstract name: string
    abstract hp: number

    maxHp: number = -1

    init() {
        this.maxHp = this.hp
        chars.push(this)
    }

    on(event: GameEvent) {}

    // EFFECTS //

    hurt(damage: number) {
        if (this.$defender) {
            return this.$defender.hurt(damage)   
        }

        this.hp = Math.max(Math.round(this.hp - damage), 0)
    }

    heal(health: number) {
        // You can't heal the dead
        if (this.hp === 0) return

        this.hp = Math.min(Math.round(this.hp + health), this.maxHp)
    }

    revive() {
        this.hp = this.maxHp
    }

    $defending: Character | undefined
    $defender: Character | undefined
    defend(defender: Character) {
        if (this.$defender) {
            return
        }

        if (defender.$defending) {
            defender.$defending.$defender = undefined
        }

        defender.$defending = this
        this.$defender = defender
    }
}

export function init<T extends Character>(...arr: T[]): T[] {
    arr.forEach(char => char.init())
    return arr
}
