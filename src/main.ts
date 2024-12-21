import { Graphics, GraphicsContext } from 'pixi.js'
import App from './app'
import { hex2pixel, HEX_SIZE } from './hexagon'
import { Viewport } from 'pixi-viewport'

const MAP_SIZE = 5

async function main() {
    const app = await App.createAndInit("black")
   
    

    let circleContext = new GraphicsContext()
        .regularPoly(0, 0, HEX_SIZE - 5, 6, 0)
        .fill(0x005500)

    for (let q = -MAP_SIZE; q <= MAP_SIZE; q++) {
        for (let r = -MAP_SIZE; r <= MAP_SIZE; r++) {
            for (let s = -MAP_SIZE; s <= MAP_SIZE; s++) {
                if (q + r + s === 0) {
                    let g = new Graphics(circleContext)

                    const { x, y } = hex2pixel({ q, r })
                    g.x = x
                    g.y = y

                    g.interactive = true
                    g.onclick = () => console.log({ q, r })

                    app.add(g)
                }
            }
        }
    }
}

main()