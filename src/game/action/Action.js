import GameObject from "../object/GameObject"
import Effect from "./Effect"

export default class Action extends GameObject {
    constructor(config) {
        super(config)

        this.addVariable({
            name: "player",
            setter: false,
            required: true
        })

        // the name of the action
        this.addVariable({
            name: "name"
        })

        // the max range of the action
        this.addVariable({
            name: "range",
            default: 1
        })

        // cost of using the action
        this.addVariable({
            name: "cost",
            default: {}
        })

        // default style of effect
        this.addVariable({
            name: "defaultStyle",
            default: "ball"
        })

        // default size of effect
        this.addVariable({
            name: "defaultSize",
            default: 1
        })

        // default size of effect
        this.addVariable({
            name: "itemTypes",
            default: []
        })

        // list of effects the action has
        this.addVariable({
            name: "effects",
            default: [],
            setter: false
        })

        this.addVariable({
            name: "requirments",
            default: {}
        })

        this.addVariable({
            name: "item"
        })
    }

    /// ///

    /**
     * 
     */
    getQueue(flip) {
        return this.getPlayer(flip).getQueue(flip)
    }

    /// ///

    /**
     * 
     * @param {*} flip 
     */
    getMap(flip) {
        return this.getPlayer(flip).getMap(flip)
    }

    /**
     * 
     * @param {boolean} flip 
     */
    getPosition(flip) {
        return this.getPlayer(flip).getPosition(flip)
    }

    /**
     * 
     * @param {boolean} flip 
     */
    getNode(flip) {
        return this.getPlayer(flip).getNode(flip)
    }

    /**
     * 
     * @param {boolean} flip 
     */
    getTile(flip) {
        return this.getPlayer(flip).getTile(flip)
    }

    /// ///

    /**
     * 
     * @param {Vec2} position 
     */
    check(target, cost) {
        // check requirments
        
        if (this.getPosition().distanceFrom(target) > this.getRange() + .5) {
            return false
        }

        if ("walkable" in this.getRequirments()) {
            if (this.getRequirments().walkable !== this.getMap().getNode(target).isWalkable()) {
                return false
            }
        }

        // cheack cost

        for (var move in cost.moves) {
            if (this.getPlayer().getMove(move) + cost.getMove(move) < 0) {
                return false
            }
        }

        if (cost.hasMP()) {
            if (this.getPlayer().getMP() + cost.getMP() <= 0) {
                return false
            }
        }

        return true
    }

    /**
     * 
     * @param {Vec2} flip 
     */
    use(position) {
        // create cost
        let cost = new Effect({
            style: "cost",
            playerEffect: this.getCost(),
            target: this.getPosition(),
            source: this
        })

        if (!this.check(position, cost.getPlayerEffect())) {
            console.debug(`${this.getPlayer()} failed to use ${this} on ${position}`)
            return false
        }

        console.debug(`${this.getPlayer()} uses ${this} on ${position}`)

        // apply cost
        cost.activate()

        // apply effects
        for (var effect of this.getEffects()) {
            new Effect({
                ...effect,
                target: position,
                source: this
            }).activate()
        }

        return true
    }
}