import { JSX } from "preact/jsx-runtime"
import { apply, STATE } from "./tabs/combat"

export interface Action {
    name: string
    target: "player" | "enemy"
    effect: (target: Character) => void
}

export const dragData: { value: (target: Character) => void | undefined } = { value: undefined }

export function fire(event: GameEvent) {
    for (const c of chars) {
        c.on(event)
    }
}

export const context: {
    source: Character | undefined
} = { source: undefined }

const Action = (action: Action) => {
    const source = context.source

    const trigger = (target: Character) => {
        action.effect(STATE.value.enemies[0])
        apply(source, action, target)
    }

    return <input
        type='button'
        value={action.name.toUpperCase()}
        onClick={() => {
            if (action.target === "enemy") {
                trigger(STATE.value.enemies[0])
            }
        }}
        draggable={action.target === "player"}
        onDragStart={() => {
            dragData.value = trigger
        }}
    />
}

type GameEvent
    = {
        kind: "END_TURN",
        action: Action,
        source: Character,
        target: Character,
    }

const chars: Character[] = []

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
}

export abstract class Enemy extends Character {}

export abstract class Player extends Character {
    abstract actions(): JSX.Element
}

export class Paladin extends Player {
    hp = 125
    name = "Paladin"

    actions() {
        return <div>
            <Action
                name="defend"
                target="player"
                effect={(target) => {
                    
                }}
             />
            {/* <Action
                name="smite"
                target="enemy"
                effect={(target) => {
                    target.hurt(50)
                }}
            /> */}
        </div>
    }
}

export class Cleric extends Player {
    hp = 75
    name = "Cleric"

    actions() {
        return <div>
            <Action
                name="heal"
                target="player"
                effect={(target) => {
                    target.heal(25)
                }}
            />
            <Action
                name="revive"
                target="player"
                effect={(target) => {
                    // use some of my maxHP
                    this.maxHp = Math.max(this.maxHp - 10, 0)
                    this.hp = Math.min(this.maxHp, this.hp)

                    // revive the target
                    target.revive()
                }}
            />
        </div>
    }
}

export class Warrior extends Player {
    hp = 100
    name = "Warrior"

    combo = 1

    on(event: GameEvent) {
        if (event.kind === "END_TURN") {
            if (event.source != this) {
                this.combo = 1
            }
        }
    }

    actions() {
        return <div>
            <Action
                name={`kick ass (*${this.combo.toFixed(1)})`}
                target="enemy"
                effect={(target) => {
                    target.hurt(10 * this.combo)
                    this.combo += 0.2
                }}
            />
        </div>
    }
}
