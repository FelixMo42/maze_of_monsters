import Value from "../util/Value";

export default {
    item: class extends Value {
        constructor(key, mod=(a)=>a) {
            super()

            this.key = key
            this.mod = mod
        }

        func(meta) {
            return this.mod(meta.action.getItem().data[this.key])
        }
    }
}