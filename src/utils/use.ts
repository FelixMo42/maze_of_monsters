import { update, WORLD, World } from "../logic/world"
import { on } from "./gameevents"

export function use<T>(data: (s: World) => T, cb: (t: T) => void) {
    let memory: T | undefined = undefined

    function check(s: World) {
        const current = data(s)
        if (current !== memory) {
            cb(current)
            memory = current
        }
    }

    on(update, check)

    check(WORLD)
}
