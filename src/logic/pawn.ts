import { Hex, hexDistance, hexEqual } from "../utils/hex"
import { capitalize } from "../utils/misc"
import { pathfind } from "../utils/pathfinding"
import { getItemAmount, Item, updateUserItem } from "./item"
import { update, WORLD, World } from "./world"

export interface Pawn {
    coord: Hex,
    kind: "basic" | "hunter" | "farmer" | "lumber",
    statuses: PawnStatus[],
    items: Item[],
    actionsLeft: number,
    actionsFull: number,
}

export type PawnStatus = "starving"

export type PawnKind = Pawn["kind"]

export function Pawn(coord: Hex): Pawn {
    return {
        coord,
        kind: "basic",
        statuses: [],
        items: [],
        actionsLeft: 2,
        actionsFull: 2,
    }
}

export function movePawn(pawn: Pawn, hex: Hex) {
    const path = pathfind(pawn.coord, hex)

    while (hasActionsLeft(pawn) && path.length > 0) {
        pawn.coord = path.shift()!
        pawn.actionsLeft -= 1
    }
}

export function pawnOnTile(world: World, hex: Hex) {
    return world.pawns.find((pawn) => hexEqual(pawn.coord, hex))
}

export function hasActionsLeft(pawn: Pawn) {
    return pawn.actionsLeft > 0
}

export function killPawn(pawn: Pawn) {
    WORLD.pawns = WORLD.pawns.filter((p) => p !== pawn)
}

export function pawnIsDead(pawn: Pawn) {
    return !WORLD.pawns.includes(pawn)
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
        if (getItemAmount(WORLD.users[0], item.name) < -item.amount) {
            return false
        }
    }

    return true
}

export function pawnDoAction(pawn: Pawn, action: PawnAction) {
    update((w) => {
        const user = w.users[0]

        if (pawnCanDoAction(pawn, action)) {
            // Use actions
            pawn.actionsLeft -= action.actionCost
            
            // Give/use items
            if (action.items) {
                action.items.forEach((item) => {
                    updateUserItem(user, item)
                })
            }

            // Apply effect
            action.effect(pawn)
        }
    })
}

export function PawnJobAction(
    name: string,
    items: Item[],
    effect: (pawn: Pawn) => void = () => {}
): PawnAction {
    return {
        name,
        items,
        type: "job",
        actionCost: 1,
        effect,
    }
}

export function PawnUpgradeAction(name: PawnKind, items: Item[]): PawnAction {
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

export function getPawnJobActions(pawn: Pawn): PawnAction[] {
    if (pawn.kind === "basic") {
        return [
            PawnJobAction("Hunt", [Item("food", 1)]),
            PawnJobAction("Gather", [Item("food", 1)]),
            PawnJobAction("Chop Wood", [Item("wood", 1)]),

            PawnUpgradeAction("hunter", [Item("wood", -2)]),
            PawnUpgradeAction("farmer", [Item("wood", -2)]),
            PawnUpgradeAction("lumber", [Item("wood", -2)]),
        ]
    } else if (pawn.kind === "hunter") {
        return [
            PawnJobAction("Hunt", [Item("food", 3)]),
        ]
    } else if (pawn.kind === "farmer") {
        return [
            PawnJobAction("Gather", [Item("food", 3)]),
        ]
    } else if (pawn.kind === "lumber") {
        return [
            PawnJobAction("Chop Wood", [Item("food", 3)]),
        ]
    }

    return []
}

export function getPawnActions(pawn: Pawn): PawnAction[] {
    return [
        ...getPawnJobActions(pawn),
        PawnJobAction("Make a baby", [], () => {
            WORLD.pawns.push(Pawn(pawn.coord))
        }),
    ]
}

// Statues

export function pawnHasStatus(pawn: Pawn, status: PawnStatus) {
    return pawn.statuses.includes(status)
}

export function givePawnStatus(pawn: Pawn, status: PawnStatus) {
    if (!pawnHasStatus(pawn, status)) {
        pawn.statuses.push(status)
    }
}

export function removePawnStatus(pawn: Pawn, status: PawnStatus) {
    pawn.statuses = pawn.statuses.filter((s) => s !== status)
}
