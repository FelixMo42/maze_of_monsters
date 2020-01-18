import React from "react"
import Callback from "./util/Callback"
import Vec2 from "./util/Vec2"
import PlayerController from "./util/PlayerController"
import { initialize } from "./settings"
import "./Game.css"

export let game = new class {
    onUpdateCallback = new Callback()
    onDrawCallback = new Callback()
    onKeyDownCallback = new Callback()
    onMouseMovedCallback = new Callback()
    onMouseDownCallback = new Callback()

    constructor() {
        this.onUpdateCallback.setup(this, "UpdateCallback")
        this.onDrawCallback.setup(this, "DrawCallback")
        this.onKeyDownCallback.setup(this, "KeyDownCallback")
        this.onMouseMovedCallback.setup(this, "MouseMovedCallback")
        this.onMouseDownCallback.setup(this, "MouseDownCallback")
    }

    getContext() {
        return this.game.context
    }

    getScale() {
        return this.game.scale
    }

    getMousePos() {
        return this.game.mousePos
    }
} ()

export default class Game extends React.Component {
    FPS = 10

    constructor(props) {
        super(props)

        game.game = this

        this.state = {
            load: (props.world || initialize)()
        }
    }

    /// mount callbacks ///

    componentDidMount() {
        this.canvas = this.refs.canvas
        this.context = this.canvas.getContext("2d")

        this.mousePos = new Vec2(0,0)
        this.scale = 60

        this.drawLoop = setInterval(() => this.draw(), 1000/this.FPS)

        this.resize()
        window.addEventListener("resize", this.resize.bind(this))
    }

    componentWillUnmount() {
        this.clearInterval(this.drawLoop)
    }

    /// draw function ///

    draw() {
        var now = Date.now()
        var dt = (now - this.lastUpdate) / 1000
        this.lastUpdate = now

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        
        game.onUpdateCallback.call(dt)
        game.onDrawCallback.call(dt)
    }

    /// using input callbacks ///

    onMouseDown(e) {
        e.preventDefault()
        game.onMouseDownCallback.call()
    }

    onMouseMoved(e) {
        e.preventDefault()
        this.mousePos = new Vec2(
            Math.floor(e.clientX/this.scale),
            Math.floor(e.clientY/this.scale)
        )
        game.onMouseMovedCallback.call()
    }

    onKeyDown(e) {
        e.preventDefault()
        game.onKeyDownCallback.call()
    }

    contextMenu(e) {
        e.preventDefault()
    }
    
    resize() {
        this.canvas.width = window.innerWidth * devicePixelRatio
        this.canvas.height = window.innerHeight * devicePixelRatio
    }

    // render it all

    render() {
        return (
            <div className="Game">
                <canvas
                    ref="canvas"
                    className="layer"

                    onContextMenu={(e) => {this.contextMenu(e)}}
                    onKeyPress={(e) => {this.onKeyDown(e)}}
                    onMouseMove={(e) => {this.onMouseMoved(e)}}
                    onClick={(e) => {this.onMouseDown(e)}}
                />
                <PlayerController loader={this.state.load} />
            </div>
        )
    }
}