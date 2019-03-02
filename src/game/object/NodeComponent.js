import GameObject from "./GameObject";

export default class NodeComponent extends GameObject {
    initializer(config) {
        this.data.node = config.node
        this.state.node = config.node
    }

    /// Node Getter/Setter ///

    /**
     * 
     */
    hasNode() {
        return this.data.node !== undefined
    }

    /**
     * 
     */
    getNode() {
        return this.data.node //TODO: undefined error 
    }

    /**
     * 
     * @param Node node 
     */
    setNode(node) {
        this.updateData({
            node: node
        })
        this.updateState({
            node: node
        })
    }

    /**
     * 
     */
    removeNode() {
        delete this.node
    }

    /// Position Getter/Setter ///

    /**
     * 
     */
    getPosition() {
        return this.data.node.getPosition() //TODO: undefined error
    }

    /**
     * 
     */
    getX() {
        return this.data.node.getX() //TODO: undefined error
    }

    /**
     * 
     */
    getY() {
        return this.data.node.getY() //TODO: undefined error
    }

    /// Map Getter ///

    /**
     * 
     */
    getMap() {
        return this.data.node.getMap() //TODO: undefined error
    }

    /// Tile Getter ///

    /**
     * 
     */
    getTile() {
        return this.data.node.getTile() //TODO: undefined error
    }

    /// Player Getter ///

    /**
     * 
     */
    hasPlayer() {
        return this.data.node.hasPlayer()
    }

    /**
     * 
     */
    getPlayer() {
        return this.data.node.getPlayer() //TODO: undefined error
    }
}