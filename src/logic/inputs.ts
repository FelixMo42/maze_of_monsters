import { Hex, hexEqual } from "../utils/hex"
import { getItemAmount, Item, updateUserItem } from "./item"
import { givePawnStatus, killPawn, movePawn, pawnHasStatus, pawnOnTile } from "./pawn"
import { update } from "./world"

const captures = new Map<string, Function>()

export function endturn() {
    update((world) => {
        // Who's turn is starting?
        const player = world.users[0]

        // Use food for all their pawns
        world.pawns.forEach((pawn) => {
            if (getItemAmount(player, "food") >= pawn.population) {
                updateUserItem(player, Item("food", -pawn.population))
                pawn.actionsLeft = pawn.actionsFull
            } else if (!pawnHasStatus(pawn, "starving")) {
                givePawnStatus(pawn, "starving")
                pawn.actionsLeft = pawn.actionsFull - 1
            } else {
                killPawn(pawn)
            }
        })

        // Reset the selected pawn
        world.selectedPawn = 0
    })
}

export function onclick(hex: Hex) {
    update((w) => {
        if (captures.has("onclick")) {
            return captures.get("onclick")!(w, hex)
        }

        if (pawnOnTile(w, hex)) {
            w.selectedPawn = w.pawns.findIndex((p) => hexEqual(p.coord, hex))
        } else {
            const pawn = w.pawns[w.selectedPawn]
            if (!pawn) return

            // Move selected pawn
            movePawn(pawn, hex)

            // Select next pawn
            if (pawn.actionsLeft === 0) {
                w.selectedPawn = (w.selectedPawn + 1) % w.pawns.length
            }
        }
    })
}

export function capture(event: string, callback: Function) {
    captures.set(event, (...params: any[]) => {
        callback(...params)
        captures.delete(event)
    })
}