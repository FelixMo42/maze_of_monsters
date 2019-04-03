let uid = 0;

export default class GameObject {
    static uses(...mixins) {
        class Base extends this {
            constructor(...parms) {
                super(...parms)

                for (var mixin of mixins) {
                    mixin.prototype.initializer.call(this, ...parms)
                }
            }
        }

        let copyProps = (base, mixin) => {
            Object.getOwnPropertyNames(mixin)
                .concat(Object.getOwnPropertySymbols(mixin))
                .forEach((prop) => {
                    Object.defineProperty(
                        base,
                        prop,
                        Object.getOwnPropertyDescriptor(mixin, prop)
                    )
                })
        }

        for (var mixin of mixins) {
            copyProps(Base.prototype, mixin.prototype)
        }

        return Base
    }

    /// ///

    constructor(config={}) {
        this.addCallback({
            name: "updateDataCallback"
        })
        this.addCallback({
            name: "updateStateCallback"
        })

        this.config = config

        this.data = {
            name: config.name,
            id: config.id
        }
        
        this.state = {...this.data}

        this.key = uid;
        uid++;
    }

    /// key and id functions ///

    /**
     * 
     */
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
                this.setState(update)
                return true
            })
        } else {
            for (var key in update) {
                this.state[key] = update[key]
            }
            this.callUpdateStateCallback(update)
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
    setData(updates) {
        for (var key in updates) {
            this.data[key] = updates[key]
        }
        this.callUpdateDataCallback(updates)
    }

    /// creator functions ///

    /**
     * 
     * @param {string} key 
     * @param {boolean} flip 
     */
    get(key, flip=false) {
        if (flip) {
            return this.state[key]
        } else {
            return this.data[key]
        }
    }

    /**
     * 
     * @param {string} key
     * @param {*} value 
     * @param {[() => boolean]} queue 
     */
    set(key, value, queue) {
        this.setData({[key]: value})
        this.setState({[key]: value}, queue)
    }

    /// constructor functions ///

    /**
     * 
     * @param {*} opts
     */
    addVariable(opts) {
        var name = opts.name.charAt(0).toUpperCase() + opts.name.slice(1)

        // add getter
        if (opts.getter !== false) {
            this[opts.getterName || "get" + name] = opts.getter || ((flip) => {
                return this.get(opts.name, flip)
            })
        }

        // add setter
        if (opts.setter !== false) {
            this[opts.setterName || "set" + name] = opts.setter || ((value, queue) => {
                return this.set(opts.name, value, queue)
            })
        }

        this.data[opts.name] = this.config[opts.name] || opts.default;

        if (opts.init) {
            this.data[opts.name] = opts.init(this.data[opts.name])
        }

        this.state[opts.name] = this.data[opts.name]
    }

    /**
     * 
     * @param {{}} opts 
     */
    addCallback(opts) {
        var callbacks = []
        var name = opts.name.charAt(0).toUpperCase() + opts.name.slice(1)
        
        this["call" + name] = (...params) => {
            for (var callback of callbacks) {
                callback(...params)
            }
        }

        // add register callback function
        this["register" + name] = (callback) => {
            callbacks.push(callback)
        }

        // add deregister callback function
        this["deregister" + name] = (callback) => {
            var indexOfCallback = callbacks.indexOf(callback);
            if (indexOfCallback > -1) {
                callbacks.splice(indexOfCallback, 1);
                return true;
            }
            return false;
        }

        // add has callback function
        this["has" + name] = (callback) => {
            return callbacks.indexOf(callback) > -1
        }
    }
}