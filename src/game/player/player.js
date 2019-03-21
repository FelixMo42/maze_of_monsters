import GameObject from "../object/GameObject"
import NodeComponent from "../object/NodeComponent";
import Game from "../Game";
import Draw from "../util/Draw";

export default class Player extends GameObject.uses(
    NodeComponent
) {
    constructor(config={}) {
        super(config)

        // apply config

        this.data.controller = config.controller || this.controller
        this.state.controller = this.data.controller

        this.addVariable({
            name: "turn",
            getterName: "isTurn",
            setter: false,
        })

        this.addVariable({
            name: "name"
        })

        this.addVariable({
            name: "color",
            default: "blue"
        })

        this.addCallback({
            name: "startTurnCallback"
        });

        this.addCallback({
            name: "endTurnCallback"
        });

        this.controller = config.controller

        // register callbacks

        Game.getInstance().registerUpdateCallback((dt) => this.processStack(dt))
    }

    /// turn ///

    startTurn() {
        console.debug(this.getName() + " has started their turn.")

        // 

        if (this.controller !== "player") {
            this.pushToStack(
                () => {
                    this.endTurn()
                }
            )
        }

        this.callStartTurnCallback(this)
    }

    endTurn() {
        console.debug(this.getName() + " has ended their turn.")

        this.isTurn = false

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