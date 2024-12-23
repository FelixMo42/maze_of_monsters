import { GameEvent } from "../utils/gameevents"
import { Hex, hexsInRange } from "../utils/hex"
import { Item, User } from "./item"
import { Pawn } from "./pawn"
import { Tile } from "./tile"

export interface World {
    selectedPawn: number
    users: User[],
    tiles: Tile[],
    pawns: Pawn[],
}

function createWorld({ mapSize }: { mapSize: number }): World {
    // Generate pawns
    const pawns = [
        Pawn(Hex(0, 0)),
    ]

    // Generate tiles
    const tiles: Tile[] = hexsInRange(mapSize).map(Tile)

    // Return the new world
    return {
        selectedPawn: 0,
        users: [{
            name: "Player 1",
            items: [],
        }],
        tiles,
        pawns,
    }
}

export const WORLD: World = createWorld({ mapSize: 5 })

export const update = GameEvent((change: (s: World) => void) => {
    change(WORLD)
    return WORLD
})
