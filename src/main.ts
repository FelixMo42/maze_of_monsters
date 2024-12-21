import { Container, Graphics } from 'pixi.js'
import App from './app'
import { HexMap } from './hexmap'
import { Pawn, State, update } from './state'
import { hex2pixel } from './hex'
import { on, use } from './gameevents'

async function main() {
    const app = await App.createAndInit("black")

    // Hexs
    const map = new HexMap({ size: 5 })
    app.add(map.view())

    // Pawns
    app.add(stateArrayView(s => s.pawns, pawnView))

    // Initial camera position
    app.viewport.fit() 
}

function pawnView(pawn: Pawn) {
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

    return g
}

function stateArrayView<T>(data: (state: State) => T[], draw: (t: T) => Container) {
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

main()