import { Graphics } from "pixi.js"
import { Tile, onclick } from "../logic/world"
import { hex2pixel, HEX_SIZE } from "../utils/hex"

export function TileView(tile: Tile) {
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
