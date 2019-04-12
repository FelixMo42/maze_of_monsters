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

        this["has" + name] = () => {
            return config.name in this.config
        }

        this["get" + name] = () => {
            return Value.cheak(this.config[config.name], this.effect.getSource())
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
}