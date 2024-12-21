import { GameEvent } from "../utils/gameevents"
import { Hex, hexDistance, hexsInRange } from "../utils/hex"

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


export function onclick(hex: Hex) {
    update((world) => {
        // Move selected pawn
        const pawn = world.pawns[world.selectedPawn]
        if (hexDistance(pawn.coord, hex) <= 1) {
            pawn.coord = hex
        }

        // Select next pawn
        world.selectedPawn = (world.selectedPawn + 1) % world.pawns.length
    })
}

export const update = GameEvent((change: (s: World) => void) => {
    change(WORLD)
    return WORLD
})
