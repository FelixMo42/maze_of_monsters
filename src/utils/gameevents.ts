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

export function clearCBs(...cbs: Function[]) {
    for (const event of GAME_EVENTS.values()) {
        for (const cb of cbs) {
            if (event.includes(cb)) {
                event.splice(event.indexOf(cb), 1)
            }
        }
    }
}
