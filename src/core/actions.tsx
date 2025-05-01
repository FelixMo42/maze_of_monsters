import { STATE } from "../view/combat"
import { Character, fire, GameEvent } from "./characters"
import { setDragData } from "./drag"
import { declareVictory, isEnemiesAlive } from "./enemies"
import { selectRandom } from "./utils"

export interface Action {
    name: string
    target: "player" | "enemy"
    effect: (target: Character) => void
}

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
        onDragStart={() => setDragData("ACTION_TRIGGER", { trigger })}
    >{action.name.toUpperCase()}</div>
}

export function apply(source: Character, action: Action, target: Character) {
    // You can only do actions while in combat
    // Aka: no healing between fights!
    if (!isEnemiesAlive()) return

    // Apply the action to the target
    action.effect(target)

    // Check if any enemies are still alive
    if (isEnemiesAlive()) {
        // If yes, enemies take their turn
        ai()
    } else {
        // Victory!
        declareVictory()
    }

    // Fire an even telling the world that the turn is over
    fire({
        kind: "END_TURN",
        action,
        target,
        source,
    })

    // Trigger a graphics redraw
    STATE.value = { ...STATE.value }
}

function ai() {
    const target = selectRandom(STATE.value.players, (t) => t.hp > 0)
    target.hurt(10)
}
