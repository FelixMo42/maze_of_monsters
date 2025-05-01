import { STATE } from "../view/combat"
import { randomize } from "./utils"

export interface Item {
    name: string
    image: string
}

// All the items in the game, in random order
export const items: Item[] = randomize([
    {
        name: "Scary Mask",
        image: "./face.png",
    },
    {
        name: "Pike",
        image: "./pike.png"
    },
])

//////////
// UTIL //
//////////

const itemPools = new Map<string, Map<string, Item>>()

export function resetItemPool(name: string, ...newItems: Item[]) {
    // Create a new item pool
    const pool = new Map()

    // Add in all the items to the pool sequentally
    for (let i = 0; i < newItems.length; i++) {
        pool.set(String(i), newItems[i])
    }

    // Replace the old pool with the new one
    itemPools.set(name, pool)

    console.log(itemPools)
}

export function getItem(location: string) {
    const [pool, slot] = location.split("/")
    return itemPools.get(pool)?.get(slot)
}

export function isOutOfNewItems() {
    return items.length < STATE.value.room
}