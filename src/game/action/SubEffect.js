import Value from "../util/Value";

export default class SubEffect {
    constructor(config) {
        this.effect = config.effect
        this.config = config
    }

    /**
     * 
     * @param {string} param 
     */
    addParamater(config) {
        var name = config.name.charAt(0).toUpperCase() + config.name.slice(1)

        this[config.hasserName || "has" + name] = () => {
            return config.name in this.config
        }

        this[config.getterName || "get" + name] = () => {
            return Value.check(this.config[config.name], this.effect.getSource())
        }
    }

    /**
     * 
     */
    getQueue() {
        return this.effect.getQueue()
    }

    /// location getters ///

    /**
     * 
     */
    getMap() {
        return this.effect.getMap()
    }

    /**
     * 
     */
    getTargetPositon() {
        return this.effect.getTargetPositon()
    }

    /**
     * 
     */
    getTargetNode() {
        return this.effect.getTargetNode()
    }

    /**
     * 
     */
    getTargetTile() {
        return this.effect.getTargetTile()
    }

    /**
     * 
     */
    getSourcePositon() {
        return this.effect.getSourcePositon()
    }

    /**
     * 
     */
    getSourceNode() {
        return this.effect.getSourceNode()
    }

    /**
     * 
     */
    getSourceTile() {
        return this.effect.getSourceTile()
    }

    getSourcePlayer() {
        return this.effect.getSourcePlayer()
    }

    /// range/size getters ///

    /**
     * 
     */
    getRange() {
        return this.effect.getRange()
    }

    /**
     * 
     */
    getSize() {
        return this.effect.getSize()
    }

    /// DC stuff ///

    /**
     * 
     */
    getAim() {
        return Value.check(this.effect.getAim(), this.effect.getSource())
    }
}