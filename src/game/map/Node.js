import GameObject from "../object/GameObject";
import Tile from "../tile/Tile";

export default class Node extends GameObject {
    constructor(config={}) {
        super(config)

        this.data.position = config.position
        this.data.map = config.map
        this.data.tile = new Tile({...config.tile, node: this})
        this.data.player = config.player
        this.data.item = config.item

        this.state.position = this.data.position
        this.state.map = this.data.map
        this.state.tile = this.data.tile
        this.state.player = this.data.player
        this.state.item = this.data.item
    }

    /// ///

    /**
     * 
     * @param {Effect} effect 
     */
    affect(effect) {
        if (this.hasTile() && effect.hasTileEffect()) {
            this.getTile().affect(effect.getTileEffect())
        }

        if (this.hasPlayer() && effect.hasPlayerEffect()) {
            this.getPlayer().affect(effect.getPlayerEffect())
        }

        //TODO: add item effect

        //TODO: add struct effect
    }

    /// Position Getter/Setter ///

    /**
     * 
     */
    getPosition(flip) {
        return this.get("position", flip)
    }

    /**
     * 
     */
    getX(flip) {
        return this.getPosition(flip).getX()
    }

    /**
     * 
     */
    getY(flip) {
        return this.getPosition(flip).getY()
    }

    /// Map Getter/Setter ///

    /**
     * 
     */
    getMap(flip) {
        return this.get("map", flip)
    }

    /// Tile Getter/Setter ///

    hasTile(flip) {
        return this.getTile(flip) !== undefined
    }

    /**
     * 
     */
    getTile(flip) {
        return this.get("tile", flip)
    }

    /**
     * 
     * @param {*} tile 
     * @param {*} queue 
     */
    setTile(tile, queue) {
        this.getTile().removeNode(queue)
        this.setData({tile: tile})
        tile.setNode(this, queue)
        this.setState({tile: tile}, queue)
    }

    /// Player Getter/Setter ///

    /**
     * 
     */
    hasPlayer(flip) {
        return this.getPlayer(flip) !== undefined
    }

    /**
     * 
     */
    getPlayer(flip) {
        return this.get("player", flip)
    }

    /**
     * 
     * @param {Player} player 
     * @param {*} queue 
     */
    setPlayer(player, queue) {
        if (this.hasPlayer()) {
            throw Error("Cant move to tile with a player allready on it!")
        }
        this.setData({player: player})
        player.setNode(this, queue)
        this.setState({player: player}, queue)
    }

    /**
     * 
     * @param {*} queue 
     */
    removePlayer(queue) {
        if (this.hasPlayer()) {
            this.getPlayer().removeNode()
            this.setData({player: undefined})
            this.setState({player: undefined}, queue)
        }
    }

    /// Structure Getter/Setter ///

    /**
     * 
     */
    hasStructure() {
        return this.data.structure !== undefined
    }

    /**
     * 
     */
    getStructure() {
        return this.data.structure
    }

    /**
     * 
     * @param {Structure} structure 
     * @param {*} queue 
     */
    setStructure(structure, queue) {
        if (this.hasStructure()) {
            this.removeStructure(queue)
        }
        this.setData({structure: structure})
        structure.setNode(this, queue)

        this.setState({structure: structure}, queue)
    }

    /**
     * 
     * @param {*} queue 
     */
    removeStructure(queue) {
        if (this.hasStructure()) {
            this.getStructure().removeNode(queue)
            this.setData({structure: undefined})
            this.setState({structure: undefined}, queue)
        }
    }

    /// Item Getter/Setter ///

    /**
     * 
     */
    hasItem() {
        return this.item !== undefined
    }

    /**
     * 
     */
    getItem() {
        return this.item
    }

    /**
     * 
     * @param {*} item 
     * @param {*} queue 
     */
    setItem(item, queue) {
        if (this.hasItem()) {
            this.removeItem(queue)
        }
        this.setData({item: item})
        item.setNode(this, queue)

        this.setState({item: item}, queue)
    }

    /**
     * 
     * @param {*} queue 
     */
    removeItem(queue) {
        if (this.hasItem()) {
            this.getItem().removeNode(queue)
            this.setData({item: undefined})
            this.setState({item: undefined}, queue)
        }
    }


    /**
     * 
     * @param {boolean} flip 
     */
    isWalkable(flip) {
        if (this.getPlayer(flip)) {
            return false
        }

        return true
    }
}