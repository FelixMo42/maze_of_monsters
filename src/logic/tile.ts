import { Hex } from "../utils/hex"

export interface Tile {
    coord: Hex
    color: number
}

export function Tile(coord: Hex): Tile {
    return {
        coord,
        color: randomGreen()
    }
}

function randomGreen(): number {
    const greenComponent = Math.floor(Math.random() * 70) + 40
    return (greenComponent << 8)
}
