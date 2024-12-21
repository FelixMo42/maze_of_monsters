import { GameEvent } from "./gameevents"
import { Hex, hexDistance } from "./hex"

export interface Pawn {
    coord: Hex
}

export interface State {
    selectedPawn: number
    pawns: Pawn[]
}

function Pawn(coord: Hex): Pawn {
    return { coord }
}

export const STATE: State = {
    selectedPawn: 0,
    pawns: [
        Pawn(Hex(0, 0)),
        Pawn(Hex(2, 2)),
        Pawn(Hex(-2, -2)),
    ],
}

export function onclick(hex: Hex) {
    update((state) => {
        // Move selected pawn
        const pawn = state.pawns[state.selectedPawn]
        if (hexDistance(pawn.coord, hex) <= 1) {
            pawn.coord = hex
        }

        // Select next pawn
        state.selectedPawn = (state.selectedPawn + 1) % state.pawns.length
    })
}

export const update = GameEvent((change: (s: State) => void) => {
    change(STATE)
    return STATE
})
