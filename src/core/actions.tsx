import { STATE } from "../view/combat"
import { Character, fire, GameEvent } from "./characters"

export interface Action {
    name: string
    target: "player" | "enemy"
    effect: (target: Character) => void
}

export const dragData: { value: (target: Character) => void | undefined } = { value: undefined }

export const context: {
    source: Character | undefined
} = { source: undefined }

export const Action = (action: Action) => {
    const source = context.source

    const trigger = (target: Character) => {
        apply(source, action, target)
    }

    return <div
        class="action"
        onClick={() => {
            if (action.target === "enemy") {
                trigger(STATE.value.enemies[0])
            }
        }}
        draggable={action.target === "player"}
        onDragStart={() => {
            dragData.value = trigger
        }}
    >{action.name.toUpperCase()}</div>
}

export function apply(source: Character, action: Action, target: Character) {
    action.effect(target)

    ai()

    fire({
        kind: "END_TURN",
        action,
        target,
        source,
    })

    STATE.value = { ...STATE.value }
}

function selectRandom<T>(arr: T[], filter: (t: T) => boolean): T {
    const a = arr.filter(filter)
    return a[Math.floor(Math.random() * a.length)]
}

function ai() {
    const target = selectRandom(STATE.value.players, (t) => t.hp > 0)
    target.hurt(10)
}
