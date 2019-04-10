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

    toString() {
        return this.getName()
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

    /**
     * 
     * @param {*} array 
     * @param {*} key 
     * @param {*} value 
     * @param {*} queue 
     */
    setArrayItem(array, key, value, queue) {
        this.data[array][key] = value
        this.callUpdateDataCallback({[array]: this.data[array]})

        if (queue) {
            queue.push(() => {
                this.state[array][key] = value
                this.callUpdateStateCallback({[array]: this.state[array]})
            })
        } else {
            this.state[array][key] = value
            this.callUpdateStateCallback({[array]: this.state[array]})
        }
    }


    mirror(func, queue) {
        this.callUpdateDataCallback(func(this.data, "data"))

        if (queue) {
            queue.push(() => {
                this.callUpdateStateCallback(func(this.state, "state"))
            })
        } else {
            this.callUpdateStateCallback(func(this.state, "state"))
        }
    }

    /**
     * 
     * @param {*} array 
     * @param {*} value 
     * @param {*} queue 
     */
    appendArrayItem(array, value, queue) {
        this.mirror((data) => {
            data[array].push(value)
            return {[array]: data[array]}
        })
    }

    /**
     * 
     * @param {*} array 
     * @param {*} value 
     * @param {*} queue 
     */
    removeArrayItem(array, value, queue) {
        var data = this.data[array]
        for (var i = data.indexOf(value) + 1; i < data.length; i++) {
            data[i - 1] = data[i]
        }
        data = data.slice(0,-1)
        this.callUpdateDataCallback({[array]: data})

        var state = this.state[array]
        if (queue) {
            queue.push(() => {
                for (i = state.indexOf(value) + 1; i < state.length; i++) {
                    data[i - 1] = data[i]
                }
                state = data.slice(0,-1)

                this.state[array].push(value)
                this.callUpdateStateCallback({[array]: state})
            })
        } else {
            for (i = state.indexOf(value) + 1; i < state.length; i++) {
                data[i - 1] = data[i]
            }
            state = data.slice(0,-1)

            this.state[array].push(value)
            this.callUpdateStateCallback({[array]: state})
        }
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

    has(key, flip=false) {
        if (flip) {
            return key in this.state
        } else {
            return key in this.data
        }
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

        // add hasser
        if (opts.hasser !== false) {
            this[opts.hasserName || "has" + name] = opts.hasser || ((value, queue) => {
                return this.has(opts.name, value, queue)
            })
        }

        this.data[opts.name] = this.config[opts.name] || opts.default;

        if (opts.init) {
            this.data[opts.name] = opts.init(this.data[opts.name])
        }

        this.state[opts.name] = this.data[opts.name]

        if (this.data[opts.name] instanceof Array) {
            this.state[opts.name] = [
                ...this.data[opts.name]
            ]
        } else if (this.data[opts.name] instanceof Object) {
            this.state[opts.name] = {
                ...this.data[opts.name]
            } 
        } else {
            this.state[opts.name] = this.data[opts.name]
        }
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