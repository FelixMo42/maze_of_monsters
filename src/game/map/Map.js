import GameObject from "../object/GameObject"
import Vec2 from "../util/Vec2";
import Game from "../Game";
import Node from "./Node";

export default class Map extends GameObject {
    players = []

    constructor(config={}) {
        super(config)

        // apply config

        this.addVariable({
            name: "turn",
            default: 0,
            setter: false
        })

        this.addVariable({
            name: "width",
            default: 10,
            setter: false
        })

        this.addVariable({
            name: "height",
            default: 10,
            setter: false
        })

        //TODO: better intale setter system
        this.data.nodes = []
        config.nodes = config.nodes || []
        for (var x = 0; x < this.getWidth(); x++) {
            this.data.nodes[x] = config.nodes[x] || []
            for (var y = 0; y < this.getHeight(); y++) {
                this.data.nodes[x][y] = new Node({
                    ...this.data.nodes[x][y],
                    position: new Vec2(x, y),
                    map: this,
                    tile: {} // config for tile
                })
            }
        }
        this.state.nodes = this.data.nodes

        // register callbacks

        Game.getInstance().registerUpdateCallback( (dt) => {this.manageTurn(dt)} )
    }

    /// Turn Managment Functions ///

    /**
     * 
     */
    manageTurn(dt) {
        if (!this.player && this.getPlayers().length > 0) {
            this.player = this.getPlayers()[this.getTurn() % this.getPlayers().length]
            this.player.startTurn()
            this.turn++
        }

        this.draw()
    }

    /**
     * 
     */
    draw() {
        var start = new Vec2(0,0)
        var end = new Vec2(this.getWidth() - 1, this.getHeight() - 1)

        Vec2.forEach(start, end, (position) => {
            this.getTile(position).draw()
        })

        Vec2.forEach(start, end, (position) => {
            if (this.hasPlayer(position)) {
                this.getPlayer(position).draw()
            }
        })
    }

    /**
     * 
     */
    nextTurn() {
        this.player = undefined
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

    /// Tile Getters/Setters ///

    /**
     * 
     * @param {Vec2} position 
     */
    hasTile(position) {
        return this.getTile(position) !== undefined
    }

    /**
     * 
     * @param {Vec2} position 
     */
    getTile(position) {
        return this.getNode(position).getTile()
    }

    /// Player Getters/Setters ///

    /**
     * 
     * @param {Vec2} position 
     */
    hasPlayer(position) {
        return this.getPlayer(position) !== undefined
    }

    /**
     * 
     * @param {Vec2} position 
     */
    getPlayer(position) {
        return this.getNode(position).getPlayer()
    }

    /**
     * 
     */
    getPlayers() {
        return this.players
    }

    /**
     * 
     * @param {Player} player 
     * @param {Vec2} position 
     * @param {[() => boolean]} queue 
     */
    addPlayer(player, position, queue) {
        if (this.hasPlayer(position)) {
            throw new Error("allready a player at position " + position)
        }
        this.players.push(player)
        this.getNode(position).setPlayer(player, queue)
        return player
    }
}