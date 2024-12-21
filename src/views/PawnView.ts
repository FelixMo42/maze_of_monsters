import { Graphics, Text } from "pixi.js"
import { Pawn, onclick } from "../logic/world"
import { hex2pixel } from "../utils/hex"
import { use } from "../utils/use"

export function PawnView(pawn: Pawn) {
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