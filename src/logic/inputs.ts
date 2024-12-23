import { Hex, hexEqual } from "../utils/hex"
import { givePawnItem, givePawnStatus, Item, killPawn, movePawn, pawnGetItemAmount, pawnHasStatus, pawnOnTile } from "./pawn"
import { update } from "./world"

export function endturn() {
    update((w) => {
        w.pawns.forEach((p) => {
            if (pawnGetItemAmount(p, "food") >= 1) {
                givePawnItem(p, Item("food", -1))
                p.actionsLeft = p.actionsFull
            } else if (!pawnHasStatus(p, "starving")) {
                givePawnStatus(p, "starving")
                p.actionsLeft = p.actionsFull - 1
            } else {
                killPawn(p)
            }
        })
        
        w.selectedPawn = 0
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
