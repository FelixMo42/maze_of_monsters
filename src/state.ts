import { GameEvent } from "./gameevents"
import { Hex } from "./hex"

export interface State {
    player: {
        coord: Hex
    }
}

export const STATE: State = {
    player: {
        coord: Hex(0, 0)
    }
}

export function onclick(hex: Hex) {
    update((state) => {
        state.player.coord = hex
    })
}

export const update = GameEvent((change: (s: State) => void) => {
    change(STATE)
    return STATE
})
