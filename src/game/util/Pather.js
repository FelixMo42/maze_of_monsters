export default class Pather {
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
        var cost = previous ? previous.cost + 1 : 0
        var dist = position.distanceFrom(previous.position)

        this.opened[this.getId(position)] = {
            //data: this.map.getNode(position),

            position: position,
            previous: previous,

            cost: cost,
            dist: dist,

            value: cost + dist
        }
    }

    close(node) {
        var id = this.getId(node.position)
        delete this.opened[id]
        this.closed[id] = node
    }

    isOpen(node) {
        return this.opened[this.getId(node)] !== undefined
    }

    isClosed(node) {
        return this.closed[this.getId(node)] !== undefined
    }

    path(start, end) {
        this.open(start)

        while (true) {
            let current = false

            for (let node of this.opened) {
                if (!current || current.value > node.value) {
                    current = node
                }
            }

            if (!current) { break }

            this.close(current)

            this.addNeighbours(current)

            if (this.isOpen(end) || this.isClosed(current)) {
                break
            }
        }

        let endId = this.getId(end)
        return this.processes(this.opened[endId] || this.closed[endId])
    }

    processes(end) {
        var nodes = []
        var node = end

        while ("previous" in node) {
            node = node.previous
            nodes.push(node)
        }

        return nodes
    }

    addNeighbours(node) {
        node.data.getNeighbours().forEach(data => {
            var position = data.getPosition()
            if (!this.isOpen(position) && !this.isClosed(position)) {
                this.open(position, node)
                if (!data.isWalkable()) {
                    this.close(position)
                }
            }
        });
    }
}