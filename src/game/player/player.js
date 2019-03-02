import GameObject from "../component/GameObject"
import NodeComponent from "../component/NodeComponent";
import ColorComponent from "../component/ColorComponent";
import Game from "../Game";

export default class Player extends GameObject.uses(
    NodeComponent, ColorComponent
) {
    constructor(config={}) {
        super(config)

        // apply config

        this.data.controller = config.controller || this.controller
        this.state.controller = this.data.controller

        // register callbacks

        Game.getInstance().registerOnUpdateCallback((dt) => this.processStack(dt))
    }

    /* turn */
    
    isTurn = false
    onStartTurnCallback = []
    onEndTurnCallback = []

    controller = "robot"

    startTurn() {
        console.debug(this.name + " has started their turn.")

        this.isTurn = true

        //

        if (this.controller !== "player") {
            this.pushToStack(
                () => {
                    this.endTurn()
                }
            )
        }

        //

        for (var callback of this.onStartTurnCallback) {
            callback(this)
        }
    }

    registerStartTurnCallback(callback) {
        this.onStartTurnCallback.push(callback)
    }

    unregisterStartTurnCallback(callback) {
        
    }

    endTurn() {
        console.debug(this.name + " has ended their turn.")

        this.isTurn = false

        for (var callback of this.onEndTurnCallback) {
            callback(this)
        }

        this.getMap().nextTurn()
    }

    registerEndTurnCallback(callback) {
        this.onEndTurnCallback.push(callback)
    }

    unregisterEndTurnCallback(callback) {
        
    }

    isTurn() {
        return this.isTurn
    }
   

   /* stack */

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
}