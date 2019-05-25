export default class ManaComponent {
    initializer() {
        this.addVariable({
            name: "maxMp",
            setterName: "setMaxMP",
            getterName: "getMaxMP",
            default: 100
        })

        this.addVariable({
            name: "mp",
            getterName: "getMP",
            setterName: "setMP",
            init: (mp) => {
                return mp === undefined ? this.getMaxMP() : mp
            }
        })
    }

    useMP(mp, opts) {
        this.setMP(this.getMP() + mp)
    }

    regenMP(mp, opts) {
        this.setMP(this.getMP() + mp)
    }
}