import { Hex, hexDistance, hexEqual, hexNeighbors } from "./hex"

type NodeID = string

interface NodeData {
    id: NodeID
    tile: Hex
    prev: string | undefined
    traveled: number
    heuristic: number
}

// A* pathfinding algorithm
export function pathfind(start: Hex, target: Hex) {
    const open = new Set<NodeID>()
    const data = new Map<NodeID, NodeData>()

    add(start)

    while (open.size > 0) {
        // Get the node with the lowest heuristic
        const current = getBestNode(open, data)

        // Recreate path
        if (hexEqual(current.tile, target)) {
            return reconstructPath(data, current)
        }

        // Remove current from open
        open.delete(current.id)

        // Add neighbors to open
        hexNeighbors(current.tile).map((neighbor) => add(neighbor, current))
    }

    function add(tile: Hex, prev?: NodeData) {
        const id = ID(tile)
        const traveled = (prev?.traveled ?? 0) + 1
        const heuristic = traveled + hexDistance(tile, target)

        if (data.has(id)) {
            const old = data.get(id)!
            if (old.traveled > traveled) {
                old.traveled = traveled
                old.heuristic = heuristic
                old.prev = prev?.id
                open.add(id)
            }
        } else {
            data.set(id, {
                id,
                tile,
                prev: prev?.id,
                traveled,
                heuristic,
            })
            open.add(id)
        }
    }
    
    return []
}

function ID(hex: Hex) {
    return JSON.stringify(hex)
}

function getBestNode(open: Set<string>, data: Map<string, NodeData>) {
    return data.get(Array.from(open).reduce((a, b) => {
        if (data.get(a)!.heuristic < data.get(b)!.heuristic) {
            return a
        } else {
            return b
        }
    }))!
}

function reconstructPath(data: Map<string, NodeData>, node: NodeData) {
    const path: Hex[] = []

    while (node.prev) {
        path.unshift(node.tile)
        node = data.get(node.prev)!
    }

    return path
}
