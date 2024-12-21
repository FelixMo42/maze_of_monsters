import { GameEvent } from "../utils/gameevents"
import { Hex, hexDistance, hexEqual, hexsInRange } from "../utils/hex"

export interface Pawn {
    coord: Hex
}

export interface Tile {
    coord: Hex
    color: number
}

export interface World {
    selectedPawn: number
    tiles: Tile[],
    pawns: Pawn[],
}

function Pawn(coord: Hex): Pawn {
    return { coord }
}

function createWorld({ mapSize }: { mapSize: number }): World {
    // Generate pawns
    const pawns = [
        Pawn(Hex(0, 0)),
        Pawn(Hex(2, 2)),
        Pawn(Hex(-2, -2)),
    ]

    // Generate tiles
    const tiles: Tile[] = hexsInRange(mapSize).map((hex) => ({
        coord: hex,
        color: randomGreen()
    }))

    // Return the new world
    return {
        selectedPawn: 0,
        tiles,
        pawns,
    }
}

function randomGreen(): number {
    const greenComponent = Math.floor(Math.random() * 70) + 40
    return (greenComponent << 8)
}

export const WORLD: World = createWorld({ mapSize: 5 })

function pawnOnTile(world: World, hex: Hex) {
    return world.pawns.find((pawn) => hexEqual(pawn.coord, hex))
}

export function onclick(hex: Hex) {
    update((w) => {
        if (pawnOnTile(w, hex)) {
            w.selectedPawn = w.pawns.findIndex((p) => hexEqual(p.coord, hex))
        } else {
            // Move selected pawn
            const pawn = w.pawns[w.selectedPawn]
            if (hexDistance(pawn.coord, hex) <= 1) {
                pawn.coord = hex
            }

            // Select next pawn
            w.selectedPawn = (w.selectedPawn + 1) % w.pawns.length
        }
    })
}

export const update = GameEvent((change: (s: World) => void) => {
    change(WORLD)
    return WORLD
})
