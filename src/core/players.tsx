import { JSX } from "preact/jsx-runtime"
import { Action } from "./actions"
import { Character, GameEvent } from "./characters"

export abstract class Player extends Character {
    abstract actions(): JSX.Element
}

export class Paladin extends Player {
    hp = 125
    name = "Paladin"

    actions() {
        return <div>
            <Action
                name={this.$defending ? `defending: ${this.$defending.name}` : "defend"}
                target="player"
                effect={(target) => {
                    target.defend(this)
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
