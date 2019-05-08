import SubEffect from "../action/SubEffect";

export default class extends SubEffect {
    constructor(config) {
        super(config)

        this.addParamater({
            name: "damage"
        })

        this.addParamater({
            name: "heal"
        })

        this.addParamater({
            name: "MP"
        })

        this.addParamater({
            name: "pull"
        })

        this.addParamater({
            name: "push"
        })

        this.addParamater({
            name: "moves"
        })
    }
}