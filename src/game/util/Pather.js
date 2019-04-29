class Grid {
    constructor(start, end) {
        this.start = {
            position: start,
            cost: 0
        }

        this.target = {
            position: end,
            dist: 0,
            value: 0
        }

        this.grid = {
            [start.x + "_" + start.y]: this.start,
            [end.x + "_" + end.y]: this.target,
        }
    }

    set(point, previous) {
        point.previous = previous
        point.cost = previous.cost + 1
        point.value = point.cost + point.dist
    }

    get(position) {
        var id = position.x + "_" + position.y

        if (!this.grid[id]) {
            this.grid[id] = {
                position: position,
                dist: this.dist(position)
            }
        }

        return this.grid[id]
    }

    dist(position) {
        return (
            (this.target.position.x - position.x) ** 2 +
            (this.target.position.y - position.y) ** 2
        )
    }
}

class Heap {
    constructor() {
        this.heap = []
        this.size = 0
    }

    put(point) {
        point.opened = true
        this.heap.push(point)
        this.size += 1
    }

    get() {
        this.size -= 1

        var current = this.heap[0]
        var id = 0

        for (let i = 0; i < this.heap.length; i++) {
            let point = this.heap[i]

            if (point.value < current.value) {
                current = point
                id = i
            }
        }

        this.heap.splice(id, 1)

        current.opened = false
        current.closed = true

        return current
    }
}

export default class Pather {
    constructor(map) {
        this.map = map
    }

    neighbours(point) {
        var neighbours = []
        for (let neighbour of this.map.getNode(point.position).getNeighbours()) {
            let neighbourPoint = this.grid.get(neighbour.getPosition())
            neighbourPoint.walkable = neighbour.isWalkable()
            neighbours.push(neighbourPoint)
        }
        return neighbours
    }

    follow(point) {
        var path = []

        while ("previous" in point) {
            path.unshift(point.position)
            point = point.previous
        }

        return path
    }

    path(start , end) {
        var grid = this.grid = new Grid(start, end)
        var heap = this.heap = new Heap()

        heap.put(grid.start)

        while (heap.size) {
            var current = heap.get()
        
            if (current === grid.target) {
                return this.follow(this.grid.target)
            }

            for (var neighbour of this.neighbours(current)) {
                if (!neighbour.walkable) {
                    if (neighbour === grid.target) {
                        return this.follow(current)
                    }
                    continue
                }

                if (neighbour.open || neighbour.closed) {
                    continue
                }

                grid.set(neighbour, current)
                heap.put(neighbour)
            }
        }
    }
}