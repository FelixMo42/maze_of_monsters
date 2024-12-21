export const HEX_SIZE = 60

// Base

export interface Hex {
    q: number
    r: number
}

export function Hex(q: number, r: number): Hex {
    return { q, r }
}

// Common

function hexAdd(hex: Hex, vec: Hex) {
    return Hex(hex.q + vec.q, hex.r + vec.r)
}

function hexSub(hex: Hex, vec: Hex) {
    return Hex(hex.q - vec.q, hex.r - vec.r)
}

// Neighbors

const HexDirectionVectors = [
    Hex(+1, 0), Hex(+1, -1), Hex(0, -1), 
    Hex(-1, 0), Hex(-1, +1), Hex(0, +1), 
] as const

type HexDirection = 0 | 1 | 2 | 3 | 4 | 5

function hexDirectionVector(direction: HexDirection): Hex {
    return HexDirectionVectors[direction]
}

export function hexNeighbor(hex: Hex, direction: HexDirection) {
    return hexAdd(hex, hexDirectionVector(direction))
}

// Distance

export function hexDistance(a: Hex, b: Hex) {
    var vec = hexSub(a, b)
    return (Math.abs(vec.q)
          + Math.abs(vec.q + vec.r)
          + Math.abs(vec.r)) / 2
}

// Pixels

export function hex2pixel(hex: Hex) {
    var x = HEX_SIZE * (Math.sqrt(3) * hex.q  +  Math.sqrt(3)/2 * hex.r)
    var y = HEX_SIZE * (                                    3/2 * hex.r)
    return { x, y }
}

// Range

export function hexsInRange(size: number) {
    const hexs: Hex[] = []
    
    for (let q = -size; q <= size; q++) {
        for (let r = -size; r <= size; r++) {
            for (let s = -size; s <= size; s++) {
                if (q + r + s === 0) {
                    hexs.push(Hex(q, r))
                }
            }
        }
    }

    return hexs
}