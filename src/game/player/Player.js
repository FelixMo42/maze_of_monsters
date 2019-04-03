import GameObject from "../object/GameObject"
import NodeComponent from "../object/NodeComponent";
import Game from "../Game";
import Draw from "../util/Draw";
import Action from "../action/Action";
import HealthComponent from "../object/HealthComponent";

export default class Player extends GameObject.uses(
    HealthComponent, NodeComponent
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
            this.damage(effect.getHP())
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

    die(queue) {
        console.debug(this.getName() + " died!")

        if (this.isTurn()) {
            this.endTurn(queue)
        }
        this.getMap().removePlayer(this, queue)
    }

    /// turn ///

    /**
     * 
     */
    startTurn() {
        console.debug(this.getName() + " starts their turn")

        this.set("turn", true)
        this.setMoves({...this.getMaxMoves()})

        if (this.getController() !== "player") {
            this.doTurn()
            this.pushToStack(
                () => {
                    this.endTurn()
                }
            )
        }

        this.callStartTurnCallback(this)
    }

    doTurn() {
        var players = this.getMap().getPlayers()
        
        var enemies = []
        var allies = []
        var neutral = []

        for (var player of players) {
            if (player === this) {
                continue
            }

            var relationship = this.relationship(player)

            if (relationship > 0) {
                allies.push(player)
            }
            if (relationship === 0) {
                neutral.push(player)
            }
            if (relationship < 0) {
                enemies.push(player)
            }
        }

        var whatToDo = "fight"

        //console.log(whatToDo, enemies[0])

        if (whatToDo === "stay") {
        }

        if (whatToDo === "fight") {
            var sucses;
            var target = enemies[0]
        
            if (target === undefined) {
                return
            }

            // move to target
            while (true) {
                sucses = this.getAction("Move").use(
                    this.getPosition().add(target.getPosition().subtract(this.getPosition()).sign())
                )
                if (!sucses) {
                    break
                }
            }

            // attack target
            while (true) {
                sucses = this.getAction("Punch").use(
                    target.getPosition()
                )
                if (!sucses || target.isDead()) {
                    break
                }
            }
        }

        if (whatToDo === "run") {
        }
    }

    /**
     * 
     */
    endTurn(queue) {
        if (!this.isTurn()) {
            return
        }

        console.debug(this.getName() + " ends their turn")

        this.set("turn", false, this.stack)

        this.getMap().nextTurn()

        this.callEndTurnCallback(this)
    }

    /**
     * 
     * @param {Player} player 
     * @param {boolean} flip 
     */
    relationship(player, flip) {
        return -1
    }

    /// moves and actions ///

    getMove(move, flip) {
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
            })
        } else {
            this.state.moves[move] = value
            this.callUpdateStateCallback({})
        }
    }

    getMaxMove(move, flip) {
        return this.getMaxMoves(flip)[move]
    }

    getAction(name) {
        for (var action of this.getActions()) {
            if (action.getName() === name) {
                return action
            }
        }
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

            if (this.stack[0]() === false) {
                return
            } else {
                this.stack.shift()
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