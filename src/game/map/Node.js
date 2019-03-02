import GameObject from "../component/GameObject";

export default class Node extends GameObject {
    constructor(config={}) {
        super(config)

        if (!config.position) {
            console.error("Node requires position parameter!")
        }

        if (!config.map) {
            console.error("Node requires map parameter!")
        }

        if (!config.tile) {
            console.error("Node requires tile config parameter!")
        }

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

    /// Position Getter/Setter ///

    getPosition() {
        return this.data.position
    }

    getX() {
        return this.data.position.getX()
    }

    getY() {
        return this.data.position.getY()
    }

    /// Map Getter/Setter ///

    getMap() {
        return this.data.map
    }

    /// Tile Getter/Setter ///

    getTile() {
        return this.data.tile
    }

    setTile(tile, queue) {
        this.getTile().removeNode(queue)
        this.updateData({tile: tile})

        tile.setNode(this, queue)

        this.updateState({tile: tile}, queue)
    }

    /// Player Getter/Setter ///

    hasPlayer() {
        return this.data.player !== undefined
    }

    getPlayer() {
        return this.data.player
    }

    setPlayer(player, queue) {
        if (this.data.hasPlayer()) {
            this.removePlayer(queue)
        }
        this.updateData({player: player})
        player.setNode(this, queue)

        this.updateState({player: player}, queue)
    }

    removePlayer(queue) {
        if (this.hasPlayer()) {
            this.getPlayer().removeNode()
            this.updateData({player: undefined})
            this.updateStyle({player: undefined}, queue)
        }
    }

    /// Structure Getter/Setter ///

    hasStructure() {
        return this.data.structure !== undefined
    }

    getStructure() {
        return this.data.structure
    }

    setStructure(structure, queue) {
        if (this.hasStructure()) {
            this.removeStructure(queue)
        }
        this.updateData({structure: structure})
        structure.setNode(this, queue)

        this.updateState({structure: structure}, queue)
    }

    removeStructure(queue) {
        if (this.hasStructure()) {
            this.getStructure().removeNode(queue)
            this.updateData({structure: undefined})
            this.updateState({structure: undefined}, queue)
        }
    }

    /// Item Getter/Setter ///

    hasItem() {
        return this.item !== undefined
    }

    getItem() {
        return this.item
    }

    setItem(item, queue) {
        if (this.hasItem()) {
            this.removeItem(queue)
        }
        this.updateData({item: item})
        item.setNode(this, queue)

        this.updateState({item: item}, queue)
    }

    removeItem() {
        if (this.hasItem()) {
            this.getItem().removeNode(queue)
            this.updateData({item: undefined})
            this.updateState({item: undefined}, queue)
        }
    }
}