import { Graphics, GraphicsContext } from 'pixi.js'
import App from './app'
import { hex2pixel, HEX_SIZE } from './hex'
import { HexMap } from './hexmap'

const MAP_SIZE = 5

async function main() {
    const app = await App.createAndInit("black")
    const map = new HexMap({ size: 5 })

    app.add(map.render())
}

main()