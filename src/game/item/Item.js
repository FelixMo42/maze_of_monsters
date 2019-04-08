import GameObject from "../object/GameObject";

export default class Item extends GameObject {
    constructor(config) {
        super(config)

        this.addVariable({
            name: "name"
        })

        this.addVariable({
            name: "player"
        })

        this.addVariable({
            name: "equiped"
        })

        this.addVariable({
            name: "slots",
            default: []
        })

        this.addVariable({
            name: "size",
            default: 1
        })
    }

    pickup(player, queue) {
        if (this.hasPlayer()) {
            console.error("attempted to pickup an item that allready has a player!")
            return
        }

        this.setPlayer(player, queue)
        player.storeItem(this, queue)
    }

    drop(queue) {
        if (!this.hasPlayer()) {
            console.error("attempted to drop an item thats dosent have player!")
            return
        }
        if (this.isEquiped()) {
            console.error("attempted to drop an item thats still equiped!")
            return
        }

        this.setPlayer(undefined, queue)
        this.getPlayer().removeItem(this, queue)
    }

    equip(slot, queue) {
        if (!this.hasPlayer()) {
            console.error("attempted to equip an item thats dosent have player!")
            return
        }
        if (this.isEquiped()) {
            console.error("attempted to equip an item thats allready equiped!")
            return
        }

        this.setEquiped(slot, queue)
        this.getPlayer().equipItem(this, queue)
    }

    unequip(queue) {
        if (!this.hasPlayer()) {
            console.error("attempted to unequip an item thats dosent have player!")
            return
        }
        if (this.isEquiped()) {
            console.error("attempted to equip an item thats allready equiped!")
            return
        }

        this.setEquiped(undefined, queue)
        this.getPlayer().unequipItem(this, queue)
    }

    isEquiped(flip) {
        return this.getEquiped(flip) !== undefined
    }
}