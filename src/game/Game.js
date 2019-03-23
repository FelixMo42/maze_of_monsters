import React from "react"
import Map from "./map/Map"
import Callback from "./util/Callback"
import Vec2 from "./util/Vec2"
import PlayerController from "./util/PlayerController"
import Player from "./player/Player";

import "./Game.css"

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

        this.onUpdateCallback.setup(this, "UpdateCallback")
        this.onDrawCallback.setup(this, "DrawCallback")
        this.onKeyDownCallback.setup(this, "KeyDownCallback")
        this.onMouseMovedCallback.setup(this, "MouseMovedCallback")
        this.onMouseDownCallback.setup(this, "MouseDownCallback")

        this.state = this.createWorld()
    }

    createWorld() {
        var state = {}

        var world = state.world = new Map()
        var players = state.players = [
            world.addPlayer(
                new Player({
                    controller: "player",
                    name: "Eden Black",
                    actions: [
                        {
                            name: "testAction",
                            effects: [
                                {
                                    playerEffect: {
                                        HP: 10
                                    }
                                }
                            ]
                        }
                    ]
                }),
                new Vec2(2,2)
            )
        ]

        players[0].getActions()[0].call(players[0].getPosition())

        return state
    }

    /// mount callbacks ///

    componentDidMount() {
        this.canvas = this.refs.layer
        this.graphics = this.canvas.getContext("2d")
        this.graphics.mousePos = new Vec2(0,0)
        this.graphics.size = 60

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

    resize() {
        this.canvas.width = window.innerWidth * devicePixelRatio
        this.canvas.height = window.innerHeight * devicePixelRatio
    }

    // render it all

    render() {
        return (
            <div className="Game">
                <canvas
                    ref="layer"
                    className="layer"

                    onContextMenu={(e) => {this.contextMenu(e)}}
                    onClick={(e) => {this.onMouseDown(e)}}
                    onMouseMove={(e) => {this.onMouseMoved(e)}}
                    onKeyPress={(e) => {this.onKeyDown(e)}}
                />

                <PlayerController players={this.state.players} />
            </div>
        )
    }
}