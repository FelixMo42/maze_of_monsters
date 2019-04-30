import GameObject from "../object/GameObject";
import Item from "../item/Item";

export default class Slot extends GameObject {
    constructor(config) {
        super(config)

        this.addVariable({
            name: "name"
        })

        this.addVariable({
            name: "maxSpots",
            default: 1
        })

        this.addVariable({
            name: "spots",
            init: (state) => {
                return state || this.getMaxSpots()
            }
        })

        this.addVariable({
            name: "items",
            default: [],
            init: (states) => {
                var items = []

                for (var state of states) {
                    items.push(new Item(state))
                }

                return items
            }
        })
    }

    /**
     * 
     * @param {Item} item 
     * @param {*} queue 
     */
    addItem(item, size, queue) {
        if (this.getSpots() + item.getSize() <= this.getMaxSpots()) {
            return false
        }
        for (var i = 0; i < size; i++) {
            this.appendArrayItem("items", item, queue)
        }
        return true
    }

    /**
     * 
     * @param {Item} item 
     * @param {*} queue 
     */
    removeItem(item, size, queue) {
        for (var i = 0; i < size; i++) {
            this.removeArrayItem("items", item, queue)
        }
    }
}