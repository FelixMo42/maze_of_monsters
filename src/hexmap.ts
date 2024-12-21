import { BlurFilter, Container, Graphics, GraphicsContext } from "pixi.js"
import { Hex, hex2pixel, HEX_SIZE } from "./hex"
import { onclick } from "./state";

interface HexData {
    coord: Hex,
    color: number
}

export class HexMap {
    size: number;
    hexs: Map<string, HexData>

    constructor({ size }: { size: number }) {
        this.size = size
        this.hexs = new Map()

        // Generate hexs
        for (let q = -size; q <= size; q++) {
            for (let r = -size; r <= size; r++) {
                for (let s = -size; s <= size; s++) {
                    if (q + r + s === 0) {
                        this.hexs.set(`${q}:${r}`, {
                            coord: { q, r },
                            color: randomGreen()
                        })
                    }
                }
            }
        }
    }

    view() {
        const container = new Container({
            filters: [ new BlurFilter({ strength: 2 }) ]
        })

        for (const hex of this.hexs.values()) {
            // Draw a hex with the right color
            const g = new Graphics()
                .regularPoly(0, 0, HEX_SIZE, 6, 0)
                .fill(hex.color)
            container.addChild(g)
        
            // Repoistion the graphic to be in the right spot
            const { x, y } = hex2pixel(hex.coord)
            g.x = x
            g.y = y
        
            // What happens when we click on the next?
            g.interactive = true
            g.onclick = () => onclick(hex.coord)
        }

        return container
    }
}

function randomGreen(): number {
    const greenComponent = Math.floor(Math.random() * 70) + 40
    return (greenComponent << 8)
}