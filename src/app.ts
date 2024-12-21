import { Application, ColorSource } from "pixi.js"

export default class App extends Application {
    background: ColorSource
    keyboard: Map<string, boolean>

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
        window.addEventListener("keydown", this.onkeydown.bind(this))
        window.addEventListener("keyup", this.onkeyup.bind(this))

        await super.init({
            background: this.background,
            resizeTo: window
        })
    }

    onkeydown(e: KeyboardEvent) {
        this.keyboard.set(e.key, true)
    }
    
    onkeyup(e: KeyboardEvent) {
        this.keyboard.set(e.key, false)
    }
}