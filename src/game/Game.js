import React from "react"
import Map from "./map/Map"
import Callback from "./util/Callback"
import Vec2 from "./util/Vec2"
import PlayerController from "./util/PlayerController"
import Player from "./player/Player";

import "./Game.css"
import { RandomValue } from "./util/Value";
import ActionRef from "./action/ActionRef";

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

        // create actions

        var move = {
            name: "Move",
            requirments: {
                walkable: true
            },
            effects: [
                {
                    style: "self",
                    playerEffect: {
                        pull: 1
                    }
                }
            ],
            cost: {
                moves: {
                    main: -1
                }
            }
        }

        var punch = {
            name: "Punch",
            effects: [
                {
                    playerEffect: {
                        HP: new RandomValue(-20, -10)
                    }
                }
            ],
            cost: {
                moves: {
                    main: -5
                }
            }
        }

        var pickup = {
            name: "Pick Up",
            effects: [
                {
                    itemEffect: {
                        pickup: true
                    }
                }
            ],
            cost: {
                moves: {
                    main: -2
                }
            }
        }

        var sword = {
            name: "Dimensional Blade",
            description: "A black blade with ancient eldrich runes inscribed on the blade. It was forged by Consilius during the bearth of hell.",
            type: "sword",
            slot: {
                hand: 1
            }
        }

        var gun = {
            name: "Eden's Revolver",
            description: "A good old six shooter past down the Eden famility that has been enchanted over the years by Black.",
            type: "gun",
            range: 10,
            slot: {
                hand: 1
            }
        }

        var slice = {
            name: "Slice",
            itemTypes: ["sword"],
            effects: [
                {
                    playerEffect: {
                        HP: new RandomValue(-100, -50)
                    }
                }
            ],
            cost: {
                moves: {
                    main: -5
                }
            },
            range: new ActionRef.item("range")
        }

        var shoot = {
            name: "Shoot",
            itemTypes: ["gun"],
            effects: [
                {
                    playerEffect: {
                        HP: new RandomValue(-50, -25)
                    }
                }
            ],
            cost: {
                moves: {
                    main: -3
                }
            },
            range: new ActionRef.item("range")
        }

        var baseAiContoller = {}

        var solder = {
            name: "foor solder",
            color: "gray",
            controller: baseAiContoller,
            actions: [
                punch,
                move
            ]
        }

        var item = {
            name: "note",
            description: "A small paper note with 'blank' writen on it."
        }

        var wall = {
            name: "wall",
            walkable: false
        }

        // set up world

        var world = state.world = new Map({
            width: 10,
            height: 11
        })

        world.addStructure(wall, new Vec2(3,4))
        world.addStructure(wall, new Vec2(3,5))
        world.addStructure(wall, new Vec2(3,6))

        /*var players = */state.players = [
            world.setPlayer(
                new Player({
                    controller: "player",
                    name: "Eden Black",
                    color: "black",
                    actions: [
                        punch,
                        pickup,
                        move,
                        slice,
                        shoot
                    ],
                    items: [
                        sword,
                        gun
                    ],
                    maxMoves: {
                        main: 7
                    }
                }),
                new Vec2(0,5)
            )
        ]

        world.setPlayer(
            new Player(solder),
            new Vec2(9,10)
        )

        world.setPlayer(
            new Player(solder),
            new Vec2(9,0)
        )

        world.setPlayer(
            new Player(solder),
            new Vec2(2,10)
        )

        world.setPlayer(
            new Player(solder),
            new Vec2(2,0)
        )

        world.addItem(
            item,
            new Vec2(1, 4)
        )

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