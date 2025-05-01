import { Character } from "./characters"

// What kinds of things can we drag in this game?
type DragData = {
    "ACTION_TRIGGER": {
        trigger: (target: Character) => void | undefined
    }
    "ITEM": { location: string }
    "NONE": undefined
}

type DragDataKind = keyof DragData

type DragInstance<T extends keyof DragData> = {
    kind: T,
    value: DragData[T]
}

const $drag: DragInstance<any>  = {
    kind: "NONE",
    value: undefined
}

export function setDragData<T extends DragDataKind>(kind: T, value: DragData[T]) {
    $drag.kind = kind
    $drag.value = value
}

export function getDragData<T extends DragDataKind>(kind: T): DragData[T] | undefined {
    if ($drag.kind === kind) {
        return $drag.value
    } else {
        return undefined
    }
}