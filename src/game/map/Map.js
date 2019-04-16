import GameObject from "../object/GameObject"
import Vec2 from "../util/Vec2";
import Game from "../Game";
import Node from "./Node";
import Item from "../item/Item";
import Structure from "../structure/Structure";

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

        this.addVariable({
            name: "nodes",
            setter: false,
            default: [],
            init: (states) => {
                var nodes = []
                for (var x = 0; x < this.getWidth(); x++) {
                    nodes[x] = states[x] || []
                    for (var y = 0; y < this.getHeight(); y++) {
                        nodes[x][y] = new Node({
                            ...nodes[x][y],
                            position: new Vec2(x, y),
                            map: this
                        })
                    }
                }
                return nodes
            }
        })

        // register callbacks

        Game.getInstance().registerUpdateCallback((dt) => {this.manageTurn(dt)})
    }

    /// Turn Managment Functions ///

    /**
     * 
     */
    manageTurn(dt) {
        if (!this.player && this.getPlayers().length > 0) {
            this.player = this.getPlayers()[this.getTurn() % this.getPlayers().length]
            this.player.startTurn()
            this.data.turn++
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
            if (this.hasStructure(position)) {
                this.getStructure(position).draw()
            }
            if (this.hasItem(position)) {
                this.getItem(position).draw()
            }
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
     * @param {Vec2} position 
     */
    getNode(position, flip) {
        return this.getNodes(flip)[position.x][position.y]
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
    setPlayer(player, position, queue) {
        if (this.hasPlayer(position)) {
            throw new Error("allready a player at position " + position)
        }
        this.players.push(player)
        this.getNode(position).setPlayer(player, queue)
        return player
    }

    /**
     * 
     * @param {*} player 
     * @param {*} queue 
     */
    removePlayer(player, queue) {
        if (player.hasNode()) {
            player.getNode().removePlayer(queue)
        }
        for (var i = this.players.indexOf(player) + 1; i < this.players.length; i++) {
            this.players[i - 1] = this.players[i]
        }
        this.players = this.players.slice(0,-1)
    }

    /// item getters/setters ///

    hasItem(position) {
        return this.getItem(position) !== undefined
    }

    getItem(position) {
        return this.getNode(position).getItem()
    }

    setItem(item, position, queue) {
        if (this.hasItem(position)) {
            throw new Error("allready a item at position " + position)
        }

        this.getNode(position).setItem(item, queue) 

        return  item
    }

    addItem(item, position, queue) {
        this.setItem(new Item(item), position, queue)
    }

    /// structor getters/setters ///

    hasStructure(position) {
        return this.getStructure(position) !== undefined
    }

    getStructure(position) {
        return this.getNode(position).getStructure()
    }

    setStructure(structure, position, queue) {
        if (this.hasStructure(position)) {
            throw new Error("allready a structor at position " + position)
        }

        this.getNode(position).setStructure(structure, queue)

        return structure
    }

    addStructure(structure, position, queue) {
        this.setStructure(new Structure(structure), position, queue)
    }
}