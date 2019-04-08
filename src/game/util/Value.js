export default class Value {
    static cheak(value) {
        if (value instanceof Value) {
            return value.func()
        } else {
            return value
        }
    }
}

export class RandomValue extends Value {
    constructor(min, max) {
        super()

        this.min = min
        this.max = max
    }

    func() {
        return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min
    }
}