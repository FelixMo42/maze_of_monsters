import { update, WORLD, World } from "../logic/world"
import { on } from "./gameevents"

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

    on(update, check)

    check(WORLD)
}
