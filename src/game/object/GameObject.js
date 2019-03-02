import Callback from "../util/Callback"

let uid = 0;

export default class GameObject {
    static uses(...mixins) {
        let base = class _Combined extends this {
            constructor(...parms) {
                super(...parms)
                mixins.forEach((mixin) => {
                    mixin.prototype.initializer.call(this, ...parms)
                })
            }
        }
        let copyProps = (target, source) => {
            Object.getOwnPropertyNames(source)
                .concat(Object.getOwnPropertySymbols(source))
                .forEach((prop) => {
                    Object.defineProperty(
                        target,
                        prop,
                        Object.getOwnPropertyDescriptor(source, prop)
                    )
                })
        }
        mixins.forEach((mixin) => {
            copyProps(base.prototype, mixin.prototype)
            copyProps(base, mixin)
        })
        return base
    }

    constructor(config={}) {
        this.onUpdateData = new Callback()
        this.onUpdateState = new Callback()

        this.onUpdateData.setup(this, "onUpdateData")
        this.onUpdateState.setup(this, "onUpdateState")

        this.data = {
            name: config.name,
            id: config.id
        }
        // set inital state to be the same as object data 
        this.state = {...this.data}

        this.key = uid;
        uid++;
    }

    /// key and id functions ///

    getKey() {
        return this.key
    }

    /// data and state functions ///

    /**
     * 
     */
    getState() {
        return this.state
    }

    /**
     * 
     * @param {*} update 
     */
    setState(update, queue) {
        if (queue) {
            queue.push(() => {
                this.updateState(update)
                return true
            })
        } else {
            for (var key in update) {
                this.state[key] = update[key]
            }
            this.onUpdateState.call(update)
        }
    }

    /**
     * 
     */
    getData() {
        return this.data
    }

    /**
     * 
     * @param {*} update 
     */
    setData(update) {
        for (var key in update) {
            this.data[key] = update[key]
        }
        this.onUpdateData.call(update)
    }
}