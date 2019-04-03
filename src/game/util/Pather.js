import { threadId } from "worker_threads";

class Pather {
    constructor(map) {
        this.reset()

        this.map = map
    }

    setMap(map) {
        this.map = map
    }

    reset() {
        this.opened = {}
        this.closed = {}
    }

    getId(position) {
        return position.toString()
    }

    open(position, previous) {
        this.opened[this.getId(position)] = {
            position: position,
            previous: previous,

            s: previous ? previous.s + 1 : 0,
            t: position.distanceFrom(previous.position)
        }
    }

    close(node) {
        var id = this.getId(node.position)
        delete this.opened[id]
        this.closed[id] = node
    }

    isOpen(node) {
        return this.opened[this.getId(node)]
    }

    isClosed(node) {
        return this.closed[this.getId(node)]
    }

    path(start, end) {
        open(start)

        while (true) {
            var current = false

            for (var node of this.opened) {
                if (!current || current.value > node.value) {
                    current = node
                }
            }

            if (!current) { break }

            close(current)

            this.addNeighbours(current)

            if (isOpen(end) || isClosed(current)) {
                break
            }
        }
    }
}