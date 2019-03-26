import PlayerEffect from "../player/PlayerEffect";
import TileEffect from "../tile/TileEffect";

export default class {
    constructor(config) {
        this.source = config.source
        this.target = config.target

        // get effects

        this.playerEffect = config.playerEffect
        this.tileEffect = config.tileEffect

        // initiate defaults

        this.style = config.style || this.source.getDefaultStyle()
        this.size = config.style || this.source.getDefaultSize()

        // activate effect

        this.activate()
    }

    /**
     * 
     */
    activate() {
        //TODO: better style code

        if (this.style === "self") {
            this.getSourceNode().affect(this)
        }
        if (this.style === "ball") {
            this.getTargetNode().affect(this) //TODO: implement style
        }

        // clear function so it cant be reused
        this.activate = () => {
            console.error("Attempted to activate Effect twice!")
        }
    }

    /// player effect getters  ///

    /**
     * 
     */
    hasPlayerEffect() {
        return this.playerEffect !== undefined
    }

    /**
     * 
     */
    getPlayerEffect() {
        return new PlayerEffect({
            ...this.playerEffect,
            effect: this
        })
    }

    /// tile effect getters  ///

    /**
     * 
     */
    hasTileEffect() {
        return this.tileEffect !== undefined
    }

    /**
     * 
     */
    getTileEffect() {
        return new TileEffect({
            ...this.tileEffect,
            effect: this
        })
    }

    /// location getters ///

    /**
     * 
     */
    getMap() {
        return this.source.getMap()
    }

    /**
     * 
     */
    getTargetPositon() {
        return this.target
    }

    /**
     * 
     */
    getTargetNode() {
        return this.getMap().getNode(this.getTargetPositon())
    }

    /**
     * 
     */
    getTargetTile() {
        return this.getMap().getTile(this.getTargetPositon())
    }

    /**
     * 
     */
    getSourcePositon() {
        return this.source.getPosition()
    }

    /**
     * 
     */
    getSourceNode() {
        return this.source.getNode()
    }

    /**
     * 
     */
    getSourceTile() {
        return this.source.getTile()
    }

    /// range/size getters ///

    /**
     * 
     */
    getRange() {
        return this.source.getRange()
    }

    /**
     * 
     */
    getSize() {
        return this.range
    }

    getStyle() {
        return this.style
    }
}