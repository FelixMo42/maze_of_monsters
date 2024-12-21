import { Graphics } from 'pixi.js'
import App from './app'
import { HexMap } from './hexmap'
import { State, update } from './state'
import { hex2pixel } from './hex'
import { on } from './gameevents'

async function main() {
    const app = await App.createAndInit("black")

    // HexMap
    const map = new HexMap({ size: 5 })
    app.add(map.render())

    // Player
    app.add(drawPlayer())

    // Initial camera position
    app.viewport.fit()
}

function drawPlayer() {
    const g = new Graphics()
        .circle(0, 0, 30)
        .fill("blue")
        .stroke({ color: "black", width: 4 })

    on(update, (state: State) => {
        const hex = state.player.coord
        const { x, y } = hex2pixel(hex)
        g.x = x
        g.y = y
    })

    return g
}

main()