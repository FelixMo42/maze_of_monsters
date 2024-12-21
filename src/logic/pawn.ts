import { Hex, hexDistance, hexEqual } from "../utils/hex"
import { World } from "./world"

export interface Item {
    name: "wood",
    amount: number,
}

export type ItemName = Item["name"]

export interface Pawn {
    coord: Hex,
    items: Item[],
    actionsLeft: number,
    actionsFull: number,
}

export function Pawn(coord: Hex): Pawn {
    return {
        coord,
        items: [],
        actionsLeft: 3,
        actionsFull: 3,
    }
}

export function pawnItem(pawn: Pawn, name: ItemName) {
    return pawn.items.find((i) => i.name === name)
}

export function givePawnItem(pawn: Pawn, item: Item) {
    if (pawnItem(pawn, item.name)) {
        pawnItem(pawn, item.name)!.amount += item.amount
    } else {
        pawn.items.push(item)
    }
}

export function pawnOnTile(world: World, hex: Hex) {
    return world.pawns.find((pawn) => hexEqual(pawn.coord, hex))
}

export function hasActionsLeft(pawn: Pawn) {
    return pawn.actionsLeft > 0
}

export function movePawn(pawn: Pawn, hex: Hex) {
    if (hasActionsLeft(pawn) && hexDistance(pawn.coord, hex) <= 1) {
        pawn.coord = hex
        pawn.actionsLeft -= 1
        return true
    }

    return false
}

export function chopwood(pawn: Pawn) {
    if (hasActionsLeft(pawn)) {
        pawn.actionsLeft -= 1
        givePawnItem(pawn, { name: "wood", amount: 1 })
        return 1
    }

    return 0
}
