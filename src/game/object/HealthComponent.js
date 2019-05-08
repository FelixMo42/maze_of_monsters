import Draw from "../util/Draw"

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
        if (opts.aim) {

        }
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