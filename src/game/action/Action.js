import GameObject from "../object/GameObject";
import Effect from "./Effect";

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
            name: "cost"
        })

        // default style of effect
        this.addVariable({
            name: "defaultStyle"
        })

        // default size of effect
        this.addVariable({
            name: "defaultSize"
        })

        // list of effects the action has
        this.addVariable({
            name: "effects",
            setter: false
        })
    }

    /// ///

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
    cheak(position) {
        if (this.getPosition().distanceFrom(position) > this.getRange()) {
            return false
        }

        return true
    }

    /**
     * 
     * @param {Vec2} flip 
     */
    call(position) {
        if (!this.cheak(position)) {
            console.debug(this.getPlayer().getName() + " failed to use " + this.getName())
            return false
        }

        console.debug(this.getPlayer().getName() + " uses " + this.getName())

        for (var effect of this.getEffects()) {
            //console.log(effect)          
            new Effect({
                ...effect,
                target: position,
                source: this
            })
        }

        new Effect({
            ...this.getCost(),
            target: this.getPosition(),
            source: this
        })

        return true
    }
}