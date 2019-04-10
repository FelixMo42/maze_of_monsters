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
    }

    pickup(player, queue) {
        if (this.hasPlayer()) {
            console.error("attempted to pickup an item that allready has a player!")
            return
        }

        this.setPlayer(player, queue)
        player.storeItem(this, queue)

        console.debug(this.getPlayer() + " picked up " + this)
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

        console.debug(this.getPlayer() + " droped " + this)
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

        console.debug(this.getPlayer() + " equiped " + this)
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

        console.debug(this.getPlayer() + " unequip " + this)
    }

    isEquipable(flip) {
        return this.getSlots(flip).length > 0
    }

    isEquiped(flip) {
        return this.getEquiped(flip) !== undefined
    }

    hasPlayer(flip) {
        return this.getPlayer(flip) !== undefined
    }
}