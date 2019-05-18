import GameObject from "../object/GameObject";
import D from "../util/D";

export default class Skill extends GameObject {
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
            name: "player"
        })
    }

    getScore(opts = {}) {
        let score = this.getLevel()

        if (opts.stat) {
            score += this.getPlayer().getStat(opts.stat)
        }

        return score
    }

    getRoll(opts = {}) {
        return this.getScore(opts) + D(opts.die || 20)
    }
}