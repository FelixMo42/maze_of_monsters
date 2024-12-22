import { Hex, hexDistance, hexEqual } from "../utils/hex"
import { movePawn, pawnOnTile } from "./pawn"
import { update } from "./world"

export function endturn() {
    update((w) => {
        w.pawns.forEach((p) => {
            p.actionsLeft = p.actionsFull
        })
    })
}

export function onclick(hex: Hex) {
    update((w) => {
        if (pawnOnTile(w, hex)) {
            w.selectedPawn = w.pawns.findIndex((p) => hexEqual(p.coord, hex))
        } else {
            const pawn = w.pawns[w.selectedPawn]

            // Move selected pawn
            movePawn(pawn, hex)

            // Select next pawn
            if (pawn.actionsLeft === 0) {
                w.selectedPawn = (w.selectedPawn + 1) % w.pawns.length
            }
        }
    })
}
