import { Container, Graphics } from "pixi.js"
import { Pawn, Tile, World, onclick } from "../logic/world"
import { hex2pixel, HEX_SIZE } from "../utils/hex"
import { use } from "../utils/gameevents"

export function GameView() {
    const c = new Container()

    c.addChild(WorldArrayView(s => s.tiles, TileView))
    c.addChild(WorldArrayView(s => s.pawns, PawnView))

    return c
}


function TileView(tile: Tile) {
    // Draw a hex with the right color
    const g = new Graphics()
        .regularPoly(0, 0, HEX_SIZE, 6, 0)
        .fill(tile.color)

    // Repoistion the graphic to be in the right spot
    const { x, y } = hex2pixel(tile.coord)
    g.x = x
    g.y = y

    // What happens when we click on the tile?
    g.interactive = true
    g.onclick = () => onclick(tile.coord)

    return g
}

function PawnView(pawn: Pawn) {
    const g = new Graphics()
        .circle(0, 0, 30)
        .fill("blue")
        .stroke({ color: "black", width: 4 })

    // Update position
    use(() => pawn.coord, () => {
        const { x, y } = hex2pixel(pawn.coord)
        g.x = x
        g.y = y
    })
    
    // Am I selected?
    use((s) => s.pawns[s.selectedPawn] === pawn, (selected) => {
        if (selected) {
            g   .clear()
                .circle(0, 0, 30)
                .fill("red")
                .stroke({ color: "black", width: 4 })
        } else {
            g   .clear()
                .circle(0, 0, 30)
                .fill("blue")
                .stroke({ color: "black", width: 4 })
        }
    })

    // What happens when we click on the pawn?
    g.interactive = true
    g.onclick = () => onclick(pawn.coord)

    return g
}

function WorldArrayView<T>(data: (World: World) => T[], draw: (t: T) => Container) {
    const sprites = new Map<T, Container>()
    const container = new Container()

    use(data, array => {
        // Add new sprites
        for (const t of array) {
            if (!sprites.has(t)) {
                sprites.set(t, draw(t))
                container.addChild(sprites.get(t)!)
            }
        }

        // Remove old sprites
        for (const [t, sprite] of sprites) {
            if (!array.includes(t)) {
                sprite.destroy()
                sprites.delete(t)
            }
        }
    })

    return container
}
