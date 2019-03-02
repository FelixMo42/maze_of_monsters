import React from "react"
import "./Game.css"
import Map from "./map/Map"
import Callback from "./util/Callback"
import Vec2 from "./util/Vec2"
import PlayerController from "./util/PlayerController"

let instance = undefined

export default class Game extends React.Component {
    static getInstance() {
        return instance
    }

    FPS = 10

    onUpdateCallback = new Callback()
    onDrawCallback = new Callback()
    onKeyDownCallback = new Callback()
    onMouseMovedCallback = new Callback()
    onMouseDownCallback = new Callback()

    constructor(props) {
        super(props)
        instance = this

        this.onUpdateCallback.setup(this, "onUpdateCallback")
        this.onDrawCallback.setup(this, "onDrawCallback")
        this.onKeyDownCallback.setup(this, "onKeyDownCallback")
        this.onMouseMovedCallback.setup(this, "onMouseMovedCallback")
        this.onMouseDownCallback.setup(this, "onMouseDownCallback")

        this.state = {}
        this.createWorld()
    }

    createWorld() {
        var world = this.state.world = new Map()
        var players = this.state.players = []

    }

    /// mount callbacks ///

    componentDidMount() {
        this.layer = this.refs.layer
        this.graphics = this.canvas.getContext("2d")
        this.graphics.mousePos = new Vec2(0,0)

        this.drawLoop = setInterval(() => this.draw(), 1000/this.FPS)
    }

    componentWillUnmount() {
        this.clearInterval(this.drawLoop)
    }

    /// draw function ///

    draw() {
        var now = Date.now()
        var dt = (now - this.lastUpdate) / 1000
        this.lastUpdate = now

        this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height)
        
        this.onUpdateCallback.call(dt)
    }

    /// using input callbacks ///

    onMouseDown(e) {
        e.preventDefault()
        this.onMouseDownCallback.call() //TODO: prosese mouse
    }

    onMouseMoved(e) {
        e.preventDefault()
        this.onMouseMovedCallback.call() //TODO: prosese mouse
    }

    onKeyDown(e) {
        e.preventDefault()
        this.onKeyDownCallback.call() //TODO: prosese key
    }

    contextMenu(e) {
        e.preventDefault()
    }

    // render it all

    render() {
        return (
            <div className="Game">
                <canvas
                    ref="layer"
                    className="layer"

                    onContextMenu={this.contextMenu}

                    onClick={(e) => {this.onMouseDown(e)}}
                    onMouseMove={(e) => {this.onMouseMoved(e)}}
                    onKeyPress={(e) => {this.onKeyDown(e)}}
                />

                <PlayerController players={this.state.players} />
            </div>
        )
    }
}