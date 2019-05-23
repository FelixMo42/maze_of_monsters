import GameObject from "../object/GameObject";
import NodeComponent from "../object/NodeComponent";
import Draw from "../util/Draw";

export default class Item extends GameObject.uses(
    NodeComponent
) {
    constructor(config) {
        super(config)

        this.addVariable({
            name: "name"
        })

        this.addVariable({
            name: "description",
            default: ""
        })

        this.addVariable({
            name: "player"
        })

        this.addVariable({
            name: "equiped",
            hasserName: "isEquiped"
        })

        this.addVariable({
            name: "type"
        })

        this.addVariable({
            name: "slots",
            init: (state) => {
                return state || (this.config.slot ? [this.config.slot] : [])
            }
        })

        this.addVariable({
            name: "size",
            default: 1
        })

        //

        this.addVariable({
            name: "range",
            default: 1
        })

        //

        this.addCallback({
            name: "equipCallback"
        })

        this.addCallback({
            name: "unequipCallback"
        })
    }

    pickup(player, queue) {
        if (this.hasPlayer()) {
            console.error("attempted to pickup an item that allready has a player!")
        }
 
        if (this.hasNode()) {
            this.getNode().removeItem()
        }

        this.setPlayer(player, queue)
        player.storeItem(this, queue)

        console.debug(`${this.getPlayer()} picked up ${this}`)
    }

    drop(queue) {
        if (!this.hasPlayer()) {
            console.error("attempted to drop an item thats dosent have player!")
        }
        if (this.isEquiped()) {
            console.error("attempted to drop an item thats still equiped!")
        }

        this.getPlayer().removeItem(this, queue)
        this.getPlayer().getNode().setItem(this)
        this.setPlayer(undefined, queue)

        console.debug(`${this.getPlayer()} droped ${this}`)
    }

    equip(slot=0, queue) {
        if (this.isEquiped()) {
            console.error("attempted to equip an item thats allready equiped!")
            return
        }
        if (!this.isEquipable()) {
            console.error("attempted to equip an item thats unequipable!")
            return
        }
        if (!this.hasPlayer()) {
            console.error("attempted to equip an item thats dosent have player!")
            return
        }

        this.setEquiped(this.getSlots()[slot], queue)

        this.getPlayer().equipItem(this, this.getSlots()[slot], queue)

        this.callEquipCallback()

        console.debug(`${this.getPlayer()} equiped ${this}`)
    }

    unequip(queue) {
        if (!this.hasPlayer()) {
            console.error("attempted to unequip an item thats dosent have player!")
            return
        }
        if (!this.isEquiped()) {
            console.error("attempted to unequip an item thats not equiped!")
            return
        }

        this.getPlayer().unequipItem(this, this.getEquiped(), queue)

        this.setEquiped(undefined, queue)

        this.callUnequipCallback()

        console.debug(`${this.getPlayer()} unequiped ${this}`)
    }

    isEquipable(flip) {
        return this.getSlots(flip).length > 0
    }

    draw() {
        Draw.circle({
            position: this.getPosition(),
            fill: "blue",
            outline: "black",
            radius: .5
        })
    }

    affect(effect) {
        if (effect.shouldPickup()) {
            this.pickup(effect.getSourcePlayer())
        }
    }
}