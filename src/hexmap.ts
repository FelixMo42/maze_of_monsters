import { Container, Graphics, GraphicsContext } from "pixi.js"
import { Hex, hex2pixel, HEX_SIZE } from "./hex"

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
                            color: Math.random() * 0x555555
                        })
                    }
                }
            }
        }
    }

    render() {
        const container = new Container()
    
        for (const hex of this.hexs.values()) {
            // Draw a hex with the right color
            const g = new Graphics()
                .regularPoly(0, 0, HEX_SIZE - 5, 6, 0)
                .fill(hex.color)
            container.addChild(g)
        
            // Repoistion the graphic to be in the right spot
            const { x, y } = hex2pixel(hex.coord)
            g.x = x
            g.y = y
        
            // What happens when we click on the next?
            g.interactive = true
            g.onclick = () => console.log(hex)
        
        }

        return container
    }
}