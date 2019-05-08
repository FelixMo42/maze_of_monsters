import GameObject from "../object/GameObject";

export default class extends GameObject {
    constructor(config={}) {
        super(config)

        this.addVariable({
            name: "name"
        })

        this.addVariable({
            name: "level",
            default: 0
        })

        this.addVariable({
            name: "stat"
        })

        this.addVariable({
            name: "player"
        })
    }

    getScore() {
        let score = this.getLevel()

        if (this.hasStat()) {
            score += this.getPlayer().getStat(this.getStat())
        }

        return score
    }
}