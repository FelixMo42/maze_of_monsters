import { Hex, hexDistance, hexEqual } from "../utils/hex"
import { capitalize } from "../utils/misc"
import { pathfind } from "../utils/pathfinding"
import { capture } from "./inputs"
import { getItemAmount, Item, updateUserItem } from "./item"
import { update, WORLD, World } from "./world"

export interface Pawn {
    coord: Hex,
    kind: "basic" | "hunter" | "farmer" | "lumber",
    population: number,
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
        population: 1,
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

export function Action(
    name: string,
    items: Item[],
    effect: (pawn: Pawn) => void = () => {}
): PawnAction {
    return {
        name,
        items,
        actionCost: 1,
        effect,
    }
}

export function getPawnActions(pawn: Pawn): PawnAction[] {
    return [
        Action("Forage", [Item("food", pawn.population)]),

        Action("Split Population", [], () => {
            capture("onclick", (w: World, hex: Hex) => {
                if (hexDistance(pawn.coord, hex) == 1) {
                    const newPawn = Pawn(hex)
                    newPawn.population = 1
                    pawn.population = pawn.population - newPawn.population
                    w.pawns.push(newPawn)
                }
            })
        }),

        Action("Increase Population", [], () => {
            pawn.population += 1
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
