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

    damage(hp, opts={}) {
        this.updateHP(hp, opts.queue)
    }

    heal(hp, opts={}) {
        this.updateHP(hp, opts.queue)
    }

    updateHP(hp, queue) {
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