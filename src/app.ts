import { Viewport } from "pixi-viewport"
import { Application, ColorSource, Container, ContainerChild } from "pixi.js"

export default class App extends Application {
    background: ColorSource
    keyboard: Map<string, boolean>
    viewport: Viewport

    constructor(background: ColorSource) {
        super()

        this.background = background
        this.keyboard = new Map()
    }

    static async createAndInit(background: ColorSource) {
        const app = new App(background)
        await app.init()
        document.body.appendChild(app.canvas)
        return app
    }

    async init() {
        // Register callbacks for keyboard manager
        window.addEventListener("keydown", this.onkeydown.bind(this))
        window.addEventListener("keyup", this.onkeyup.bind(this))

        // Initilize the Pixijs app, and bind it to the window
        await super.init({
            background: this.background,
            resizeTo: window,
            antialias: true,
            resolution: devicePixelRatio,
        })

        // Set up the camera
        this.viewport = new Viewport({
            events: this.renderer.events
        })
        this.stage.addChild(this.viewport)
        this.viewport.moveCorner(
            -window.innerWidth / 4,
            -window.innerHeight / 4
        )
        this.viewport.scale = 1 / devicePixelRatio
        this.viewport // plugings
            .drag()
            .pinch()
            .wheel()
            // .decelerate()
    }

    onkeydown(e: KeyboardEvent) {
        this.keyboard.set(e.key, true)
    }
    
    onkeyup(e: KeyboardEvent) {
        this.keyboard.set(e.key, false)
    }

    add<U extends Container<ContainerChild>[]>(...children: U): U[0] {
        this.viewport.addChild(...children)
        return children[0]
    }
}