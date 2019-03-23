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

        this.addVariable({
            name: "turn",
            getterName: "isTurn",
            setter: false,
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
            console.log(effect.getHP())
        }
    }

    /// turn ///

    startTurn() {
        console.debug(this.getName() + " starts their turn.")

        if (this.getController() !== "player") {
            this.pushToStack(
                () => {
                    this.endTurn()
                }
            )
        }

        this.callStartTurnCallback(this)
    }

    endTurn() {
        console.debug(this.getName() + " ends their turn.")

        this.set("isTurn", false, this.stack)

        this.getMap().nextTurn()

        this.callEndTurnCallback(this)
    }

    isTurn() {
        return this.isTurn
    }
   

    /// stack ///

    stack = []

    pushToStack(func) {
       this.stack.push(func)
    }

    processStack(dt) {
        if (this.stack.length === 0) {
            return
        }

        while (true) {
            if (!this.stack[0]()) {
                return
            }
        }
    }

    /// graphics ///

    draw() {
        Draw.circle({
            x: this.getX(),
            y: this.getY(),
            fill: this.getColor(),
            outline: "black"
        })
    }
}