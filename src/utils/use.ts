import { update, WORLD, World } from "../logic/world"
import { clearCBs, on } from "./gameevents"

const context: { uses?: Array<Function> } = { uses: undefined }

export function captureUses(cb: () => void) {
    const uses: Array<Function> = []
    const prev = context.uses
    context.uses = uses
    cb()
    context.uses = prev
    return uses
}

export function use<T>(data: (s: World) => T, cb: (t: T) => void) {
    let memory: string = ""

    function check(s: World) {
        const result = data(s)
        const current = JSON.stringify(result)
        if (current !== memory) {
            cb(result)
            memory = current
        }
    }

    if (context.uses) {
        context.uses.push(check)
    }

    on(update, check)

    check(WORLD)
}
