import GameObject from "../object/GameObject"
import NodeComponent from "../object/NodeComponent";
import Game from "../Game";
import Draw from "../util/Draw";
import Action from "../action/Action";

export default class Player extends GameObject.uses(
    NodeComponent
) {
    constructor(config={}) {
        super(config)

        this.stack = []

        this.addVariable({
            name: "turn",
            getterName: "isTurn",
            setter: false,
            default: false
        })

        this.addVariable({
            name: "name"
        })

        this.addVariable({
            name: "HP",
            default: 100
        })

        this.addVariable({
            name: "MP",
            default: 100
        })

        this.addVariable({
            name: "controller",
            default: "robot"
        })

        this.addVariable({
            name: "color",
            default: "blue"
        })

        //TODO: more unified move type list

        this.addVariable({
            name: "maxMoves",
            default: {},
            setter: false,
            init: (state) => {
                return {
                    "movement": 5,
                    "main": 1,
                    "quick": 2,
                    "reaction": 1,
                    ...state
                }
            }
        })

        this.addVariable({
            name: "moves",
            default: {},
            init: (state) => {
                return {
                    ...this.getMaxMoves(),
                    ...state
                }
            }
        })

        this.addVariable({
            name: "actions",
            setter: false,
            init: (states) => {
                var actions = []
                
                for (var state of states) {
                    actions.push(new Action({
                        ...state,
                        player: this
                    }))
                }

                return actions
            }
        })

        this.addCallback({
            name: "startTurnCallback"
        });

        this.addCallback({
            name: "endTurnCallback"
        });

        // register callbacks

        Game.getInstance().registerUpdateCallback((dt) => this.processStack(dt))
    }

    /**
     * 
     * @param {PlayerEffect} effect 
     */
    affect(effect) {
        if (effect.hasHP()) {
            console.log(effect.getHP()) //TODO: make it
        }

        if (effect.hasPull()) {
            this.move(effect.getTargetPositon(), effect.getQueue()) //TODO: make it not teleportation
        }

        if (effect.hasPush()) {
            console.log(effect.getPush()) //TODO: make it
        }

        if (effect.hasMoves()) {
            this.useMoves(effect.getMoves(), effect.getQueue())
        }
    }

    move(position, queue) {
        console.debug(this.getName() + " moves to " + position)

        var map = this.getMap()
        this.getNode().removePlayer(queue)
        map.getNode(position).setPlayer(this, queue)
    }

    /// turn ///

    /**
     * 
     */
    startTurn() {
        console.debug(this.getName() + " starts their turn")

        this.setMoves({...this.getMaxMoves()})

        if (this.getController() !== "player") {
            this.pushToStack(
                () => {
                    this.endTurn()
                }
            )
        }

        this.callStartTurnCallback(this)
    }

    /**
     * 
     */
    endTurn() {
        console.debug(this.getName() + " ends their turn")

        this.set("isTurn", false, this.stack)

        this.getMap().nextTurn()

        this.callEndTurnCallback(this)
    }

    /// moves and actions ///

    getMove(move, flip) {
        return this.getMoves(flip)[move]
    }

    getMovesLeft(move, flip) {
        return this.getMoves(flip)[move]
    }

    useMoves(moves, queue) {
        for (var move in moves) {
            this.setMove(move, this.getMove(move) + moves[move], queue)
        }
    }

    setMove(move, value, queue) {
        this.data.moves[move] = value
        this.callUpdateDataCallback({})

        if (queue) {
            queue.push(() => {
                this.state.moves[move] = value
                this.callUpdateStateCallback({})
                return true
            })
        } else {
            this.state.moves[move] = value
            this.callUpdateStateCallback({})
        }
    }

    getMaxMove(move, flip) {
        return this.getMaxMoves(flip)[move]
    }

    /// stack ///

    /**
     * 
     */
    getQueue(flip) {
        return this.stack
    }

    /**
     * 
     * @param {() => boolean} func
     */
    pushToStack(func) {
       this.stack.push(func)
    }

    /**
     * 
     * @param {number} dt
     */
    processStack(dt) {
        while (true) {
            if (this.stack.length === 0) {
                return
            }

            if (!this.stack[0]()) {
                return
            } else {
                this.stack.pop()
            }
        }
    }

    /// graphics ///

    draw() {
        Draw.circle({
            position: this.getPosition(),
            fill: this.getColor(),
            outline: "black"
        })
    }
}