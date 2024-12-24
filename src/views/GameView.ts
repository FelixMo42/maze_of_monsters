import { Container } from "pixi.js"
import { World } from "../logic/world"
import { captureUses, use } from "../utils/use"
import { TileView } from "./TileView"
import { PawnView } from "./PawnView"
import { clearCBs } from "../utils/gameevents"
import { TileOverlayView } from "./TileOverlayView"

export function GameView() {
    const c = new Container()

    c.addChild(WorldArrayView(s => s.tiles, TileView))
    c.addChild(TileOverlayView())
    c.addChild(WorldArrayView(s => s.pawns, PawnView))

    return c
}

function WorldArrayView<T>(data: (w: World) => T[], draw: (t: T) => Container) {
    const sprites = new Map<T, Container>()
    const container = new Container()
    const callbacks = new Map<T, Function[]>()

    use(data, array => {
        // Add new sprites
        for (const t of array) {
            if (!sprites.has(t)) {
                callbacks.set(t, captureUses(() => {
                    sprites.set(t, draw(t))
                    container.addChild(sprites.get(t)!)
                }))
            }
        }

        // Remove old sprites
        for (const [t, sprite] of sprites) {
            if (!array.includes(t)) {
                sprite.destroy()
                sprites.delete(t)
                clearCBs(...callbacks.get(t)!)
            }
        }
    })

    return container
}
