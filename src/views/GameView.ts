import { Container } from "pixi.js"
import { World } from "../logic/world"
import { use } from "../utils/use"
import { TileView } from "./TileView"
import { PawnView } from "./PawnView"

export function GameView() {
    const c = new Container()

    c.addChild(WorldArrayView(s => s.tiles, TileView))
    c.addChild(WorldArrayView(s => s.pawns, PawnView))

    return c
}

function WorldArrayView<T>(data: (w: World) => T[], draw: (t: T) => Container) {
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
