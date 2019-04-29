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
            if (!neighbour.isWalkable()) {
                continue
            }
            neighbours.push(this.grid.get(neighbour.getPosition()))
        }
        return neighbours
    }

    path(start , end) {
        var grid = this.grid = new Grid(start, end)
        var heap = this.heap = new Heap()

        //var i = 100

        heap.put(grid.start)

        while (heap.size) {
            var current = heap.get()
        
            if (current === grid.target) {
                break
            }

            for (var neighbour of this.neighbours(current)) {
                //if (!neighbor.walkable) {
                //    continue
                //}

                if (neighbour.open || neighbour.closed) {
                    continue
                }

                grid.set(neighbour, current)
                heap.put(neighbour)
            }        

            /*i -= 1
            console.log(i, current.position, current)
            if (i === 0) {
                return
            }*/
        }

        var path = []

        var point = this.grid.target

        while ("previous" in point) {
            path.unshift(point.position)
            point = point.previous
        }

        return path
    }
}