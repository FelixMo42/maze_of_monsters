import Draw from "../util/Draw"
import skills from "../../data/skills"

export default class HealthComponent {
    initializer() {
        this.addVariable({
            name: "maxHp",
            setterName: "setMaxHP",
            getterName: "getMaxHP",
            default: 100
        })

        this.addVariable({
            name: "hp",
            setterName: "setHP",
            getterName: "getHP",
            init: (hp) => {
                return hp === undefined ? this.getMaxHP() : hp
            }
        })

        this.addVariable({
            name: "alive",
            getterName: "isAlive",
            default: true
        })
    }

    damage(opts={}) {
        var hp = opts.hp

        /*if (opts.aim) {
            let aim = opts.aim
            let dodge = this.getSkill(skills.dodge).getRoll({stat: "dex"})

            if (aim * 2 < dodge) {
                console.log("miss")
                hp = 0
                return // return if miss
            } else if (aim < dodge) {
                console.log("fail")
                hp /= 2
            } else if (aim > dodge * 2) {
                console.log("crit")
                hp *= 2
            } else {
                console.log("hit")
            }
        }

        hp += this.getSkill(skills.defence).getScore({stat: "def"})*/

        //if (hp > 0) {
        //    return // return if no damage delt
        //}

        this.updateHP(hp, opts.queue)
    }

    heal(opts={}) {
        this.updateHP(opts.hp, opts.queue)
    }

    updateHP(hp, queue) {
        let pos = this.getPosition().clone()
        let timer = 2
        this.getMap().addOveraly((dt) => {
            timer -= dt
        
            pos.y -= dt / 2

            Draw.text({
                fill: "red",
                position: pos,
                text: hp
            })

            return timer < 0
        })

        this.setHP(this.getHP() + hp, queue)
        
        console.debug(this.getName() + " is at " + this.getHP() + "/" + this.getMaxHP() + " hp")

        if (this.getHP() <= 0) {
            if ("die" in this) {
                this.setAlive(false, queue)
                this.die()
            }
        }
    }

    isDead(flip) {
        return !this.isAlive(flip)
    }
}