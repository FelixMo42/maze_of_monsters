import { World, WORLD, update } from "../logic/world"

const GAME_EVENTS = new Map<Function, Function[]>()

export function GameEvent<A, B>(cb: (_: A) => B) {
    const self = (a: A) => {
        const param = cb(a)
        for (const cb of GAME_EVENTS.get(self)!) {
            cb(param)
        }
        return param
    }

    GAME_EVENTS.set(self, [])

    return self
}

export function on<A, B>(hook: (_: A) => B, cb: (_: B) => void) {
    GAME_EVENTS.get(hook)?.push(cb)
}

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
