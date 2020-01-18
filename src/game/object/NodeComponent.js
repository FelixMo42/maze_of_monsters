export default class NodeComponent {
    initializer(config) {
        this.data.node = this.state.node = config.node
    }

    /// Node Getter/Setter ///

    /**
     * 
     */
    hasNode(flip) {
        return this.getNode(flip) !== undefined
    }

    /**
     * 
     */
    getNode(flip) {
        return this.get("node", flip) //TODO: undefined error
    }

    /**
     * 
     * @param Node node 
     */
    setNode(node, queue) {
        this.setData({
            node: node
        })

        this.setState({
            node: node
        }, queue)
    }

    /**
     * 
     */
    removeNode(queue) {
        this.setData({
            node: undefined
        })
        this.setState({
            node: undefined
        }, queue)
    }

    /// Position Getter/Setter ///

    /**
     * 
     */
    getPosition(flip) {
        return this.getNode(flip).getPosition(flip) //TODO: undefined error
    }

    /**
     * 
     */
    getX(flip) {
        return this.getNode(flip).getX(flip) //TODO: undefined error
    }

    /**
     * 
     */
    getY(flip) {
        return this.getNode(flip).getY(flip) //TODO: undefined error
    }

    /// Map Getter ///

    /**
     * 
     */
    getMap(flip) {
        return this.getNode(flip).getMap(flip) //TODO: undefined error
    }

    /// Tile Getter ///

    /**
     * 
     */
    getTile(flip) {
        return this.getNode(flip).getTile(flip) //TODO: undefined error
    }

    /// Player Getter ///

    /**
     * 
     */
    hasPlayer(flip) {
        return this.getNode(flip).hasPlayer(flip) !== undefined
    }

    /**
     * 
     */
    getPlayer(flip) {
        return this.getNode(flip).getPlayer(flip) //TODO: undefined error
    }
}