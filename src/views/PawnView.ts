import { Graphics, Text } from "pixi.js"
import { hex2pixel } from "../utils/hex"
import { use } from "../utils/use"
import { Pawn } from "../logic/pawn"
import { onclick } from "../logic/inputs"

export function PawnView(pawn: Pawn) {
    // Draw the pawn
    const g = new Graphics()
    use((s) => s.pawns[s.selectedPawn] === pawn, (selected) => {
        g   .clear()
            .circle(0, 0, 30)
            .fill(selected ? 0x928ECC : 0x928E85)
            .stroke({ color: 0x222222, width: 4 })
    })

    // Add text with population to the pawn
    const text = g.addChild(new Text({
        text: pawn.population.toString(),
        style: {
            fill: 0x222222,
            fontSize: 30,
            align: "center",
        },
        anchor: 0.5
    }))

    use(() => pawn.population, (pop) => {
        text.text = pop.toString()
    })

    // Update position
    use(() => pawn.coord, () => {
        const { x, y } = hex2pixel(pawn.coord)
        g.x = x
        g.y = y
    })

    // What happens when we click on the pawn?
    g.interactive = true
    g.onpointertap = (e) => onclick(pawn.coord, e)

    return g
}