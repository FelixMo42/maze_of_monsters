import React from "react"
import Callback from "./util/Callback"
import Vec2 from "./util/Vec2"
import PlayerController from "./util/PlayerController"
import Map from "./map/Map"

import players from "./data/players"
import structures from "./data/structures"
import items from "./data/items"

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

        // create world

        var world = state.world = new Map({
            width: 10,
            height: 11
        })

        world.addStructure(structures.wall, new Vec2(3,4))
        world.addStructure(structures.wall, new Vec2(3,5))
        world.addStructure(structures.wall, new Vec2(3,6))

        // add player character

        state.players = [
            world.addPlayer(players.edenBlack, new Vec2(0,5))
        ]

        // add enemies

        world.addPlayer(players.solder, new Vec2(9,10))
        world.addPlayer(players.solder, new Vec2(9,0))
        world.addPlayer(players.solder, new Vec2(2,10))
        world.addPlayer(players.solder, new Vec2(2,0))
        
        world.addItem(items.note, new Vec2(1, 4))

        // return state

        return state
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
        
        this.onUpdateCallback.call(dt)
        this.onDrawCallback.call(dt)
    }

    /// using input callbacks ///

    onMouseDown(e) {
        e.preventDefault()
        this.onMouseDownCallback.call()
    }

    onMouseMoved(e) {
        e.preventDefault()
        this.mousePos = new Vec2(
            Math.floor(e.clientX/this.scale),
            Math.floor(e.clientY/this.scale)
        )
        this.onMouseMovedCallback.call()
    }

    onKeyDown(e) {
        e.preventDefault()
        this.onKeyDownCallback.call()
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

                <PlayerController players={this.state.players} />
            </div>
        )
    }
}