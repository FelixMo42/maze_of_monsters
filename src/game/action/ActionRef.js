import Value from "../util/Value";

export default {
    item: class extends Value {
        constructor(key, mod=(a)=>a) {
            super()

            this.key = key
            this.mod = mod
        }

        func(action) {
            return this.mod(action.getItem().get(this.key))
        }
    },

    playerSkill: class extends Value {
        constructor(skill, mod=(a)=>a) {
            super()

            this.skill = skill
            this.mod = mod
        }

        func(action) {
            return this.mod(action.getPlayer().getSkill(this.skill))
        }
    }
}