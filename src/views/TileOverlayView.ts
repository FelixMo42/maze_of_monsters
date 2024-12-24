import { Container, Graphics, GraphicsContext } from "pixi.js"
import { hex2pixel, hexEqual, hexsInRange } from "../utils/hex"
import { use } from "../utils/use"
import { WORLD } from "../logic/world"
import { Pawn } from "../logic/pawn"

const TARGET = new GraphicsContext()
        .circle(0, 0, 9)
        .fill(0x0000ff)
        .circle(0, 0, 18)
        .stroke({
            color: 0x0000ff,
            width: 7,
        })

function MovementOverlayView(pawn: Pawn) {
    const c = new Container()

    c.eventMode = "none"

    hexsInRange(pawn.actionsLeft, pawn.coord).forEach(hex => {
        const tile = WORLD.tiles.find(t => hexEqual(t.coord, hex))
        if (tile) {
            const g = new Graphics(TARGET)
            
            const { x, y } = hex2pixel(tile.coord)
            g.x = x
            g.y = y

            g.alpha = 0.25

            c.addChild(g)
        }
    })

    return c
}

export function TileOverlayView() {
    const c = new Container()

    use(w => w.pawns[w.selectedPawn], (pawn) => {
        // Clear the overlay
        while (c.children[0]) { c.removeChild(c.children[0]) }

        // If no pawn selected, then were done here
        if (!pawn) return

        // Currently this is the only supported overlay
        c.addChild(MovementOverlayView(pawn))        
    })

    return c
}