import GameObject from "../object/GameObject"
import Vec2 from "../util/Vec2";
import Game from "../Game";

export default class Map extends GameObject {
    constructor(config={}) {
        super(config)

        // apply config

        this.data.turn = config.data || 0
        this.data.width = config.width || 10
        this.data.height = config.height || 10
        this.data.nodes = config.nodes || []

        for (var x = 0; x < this.width; x++) {
            this.data.nodes[x] = this.data.nodes[x] || []
            for (var y = 0; y < this.height; y++) {
                this.data.nodes[x][y] = new Node(this.data.nodes[x][y] || {
                    position: new Vec2(x, y),
                    map: this,
                    tile: {} // config for tile
                })
            }
        }

        // initilize state

        this.state.turn = this.data.turn
        this.state.width = this.data.width
        this.state.height = this.data.height
        this.state.nodes = this.data.nodes
        this.state.actions = this.data.actions

        // register callbacks

        Game.getInstance().registerUpdateCallback( (dt) => this.manageTurn(dt) )
    }

    /// Turn Managment Functions ///

    manageTurn(dt) {
        if (!this.player && this.getPlayers().length > 0) {
            this.player = this.getPlayers()[this.getTurn() % this.players.length]
            this.player.startTurn()
            this.turn++
        }
    }

    nextTurn() {
        this.player = undefined
    }

    getTurn() {
        return this.data.turn
    }

    /// Position Getters ///

    /**
     * 
     */
    getWidth() {
        return this.data.width
    }

    /**
     * 
     */
    getHeight() {
        return this.data.height
    }

    /// Node Getters ///

    /**
     * 
     */
    getNodes() {
        return this.data.nodes
    }

    /**
     * 
     * @param {Vec2} position 
     */
    getNode(position) {
        return this.data.nodes[position.x][position.y]
    }

    /// Player Getters/Setters ///

    getPlayers() {
        return this.data.players
    }
}