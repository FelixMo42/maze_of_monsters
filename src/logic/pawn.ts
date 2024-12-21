import { Hex, hexDistance, hexEqual } from "../utils/hex"
import { capitalize } from "../utils/misc"
import { update, World } from "./world"

export interface Pawn {
    coord: Hex,
    kind: "basic" | "hunter" | "farmer" | "lumber",
    items: Item[],
    actionsLeft: number,
    actionsFull: number,
}

export type PawnKind = Pawn["kind"]

export function Pawn(coord: Hex): Pawn {
    return {
        coord,
        kind: "basic",
        items: [],
        actionsLeft: 3,
        actionsFull: 3,
    }
}

export function movePawn(pawn: Pawn, hex: Hex) {
    if (hasActionsLeft(pawn) && hexDistance(pawn.coord, hex) <= 1) {
        pawn.coord = hex
        pawn.actionsLeft -= 1
        return true
    }

    return false
}


export function pawnOnTile(world: World, hex: Hex) {
    return world.pawns.find((pawn) => hexEqual(pawn.coord, hex))
}

export function hasActionsLeft(pawn: Pawn) {
    return pawn.actionsLeft > 0
}

// Actions

export interface PawnAction {
    name: string,
    type: "upgrade" | "job"
    actionCost: number,
    items: Item[],
    effect: (pawn: Pawn) => void,
}

function pawnCanDoAction(pawn: Pawn, action: PawnAction) {
    // Make sure we have enough actions
    if (pawn.actionsLeft < action.actionCost) {
        return false
    }

    // Make sure we have enough items
    for (const item of action.items) {
        if (pawnGetItemAmount(pawn, item.name) < -item.amount) {
            return false
        }
    }

    return true
}

export function pawnDoAction(pawn: Pawn, action: PawnAction) {
    update((_w) => {
        if (pawnCanDoAction(pawn, action)) {
            // Use actions
            pawn.actionsLeft -= action.actionCost
            
            // Give/use items
            if (action.items) {
                action.items.forEach((item) => {
                    givePawnItem(pawn, item)
                })
            }

            // Apply effect
            action.effect(pawn)
        }
    })
}

export function PawnJobAction(name: string, items: Item[] = []): PawnAction {
    return {
        name,
        items,
        type: "job",
        actionCost: 1,
        effect: () => {},
    }
}

export function PawnUpgradeAction(name: PawnKind, items: Item[] = []): PawnAction {
    return {
        name: `UP: ${capitalize(name)}`,
        items,
        type: "upgrade",
        actionCost: 0,
        effect: (pawn: Pawn) => {
            pawn.kind = name
        }
    }
}

export function getPawnActions(pawn: Pawn): PawnAction[] {
    if (pawn.kind === "basic") {
        return [
            PawnJobAction("Hunt", [{ name: "food", amount: 1 }]),
            PawnJobAction("Gather", [{ name: "food", amount: 1 }]),
            PawnJobAction("Chop Wood", [{ name: "wood", amount: 1 }]),

            PawnUpgradeAction("hunter", [{ name: "wood", amount: -2 }]),
            PawnUpgradeAction("farmer", [{ name: "wood", amount: -2 }]),
            PawnUpgradeAction("lumber", [{ name: "wood", amount: -2 }]),
        ]
    } else if (pawn.kind === "hunter") {
        return [
            PawnJobAction("Hunt", [{ name: "food", amount: 3 }]),
        ]
    } else if (pawn.kind === "farmer") {
        return [
            PawnJobAction("Gather", [{ name: "food", amount: 3 }]),
        ]
    } else if (pawn.kind === "lumber") {
        return [
            PawnJobAction("Chop Wood", [{ name: "food", amount: 3 }]),
        ]
    }

    return [PawnJobAction("Error!", [])]
}

// Items

export interface Item {
    name: "wood" | "food",
    amount: number,
}

export type ItemName = Item["name"]

function pawnGetItemAmount(pawn: Pawn, name: ItemName) {
    return pawnItem(pawn, name)?.amount || 0
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
