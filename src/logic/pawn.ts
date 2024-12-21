import { Hex, hexEqual } from "../utils/hex"
import { World } from "./world"

export interface Pawn {
    coord: Hex,
    actionsLeft: number,
    actionsFull: number,
}

export function Pawn(coord: Hex): Pawn {
    return {
        coord,
        actionsLeft: 3,
        actionsFull: 3,
    }
}

export function pawnOnTile(world: World, hex: Hex) {
    return world.pawns.find((pawn) => hexEqual(pawn.coord, hex))
}
