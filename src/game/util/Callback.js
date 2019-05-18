export default class Callback {
    callbacks = []
    
    /**
     * Calls all callbacks in stack.
     * @param  {...any} params Parameters to pass to callbacks.
     */
    call(...params) {
        for (var callback of this.callbacks) {
            callback(...params)
        }
    }

    /**
     * Registers a callback.
     * @param {function} callback Callback to register.
     */
    register(callback) {
        if (!callback) {
            throw new Error("Callback.register must have parameter callback!")
        }

        this.callbacks.push(callback)
    }

    /**
     * Deregisters a callback.
     * @param {function} callback Callback to deregister.
     * @return {boolean} Whether it successfully deregister callback.
     */
    deregister(callback) {
        if (!callback) {
            throw new Error("Callback.deregister must have parameter callback!")
        }

        var indexOfCallback = this.callbacks.indexOf(callback);
        if (indexOfCallback > -1) {
            this.callbacks.splice(indexOfCallback, 1);
            return true;
        }
        return false;
    }

    /**
     * Returns whether the stack has the callback.
     * @param {function} callback Callback to check against.
     * @return {boolean} Whether it has callback.
     */
    hasCallback(callback) {
        if (!callback) {
            throw new Error("Callback.hasCallback must have parameter callback!")
        }

        return this.callbacks.indexOf(callback) > -1
    }

    /**
     * Adds register and deregister functions to gameObject
     * @param {*} gameObject GameObject to add functions too
     * @param {*} name name to use for functions
     */
    setup(gameObject, name) {
        if (!gameObject) {
            throw new Error("Callback.setup must have gameObject parameter!")
        }
        if (!name) {
            throw new Error("Callback.setup must have name parameter!")
        }

        // capitilize first letter of name
        name = name.charAt(0).toUpperCase() + name.slice(1)

        // add register callback function
        gameObject["register" + name] = (callback) => {
            return this.register(callback)
        }

        // add deregister callback function
        gameObject["deregister" + name] = (callback) => {
            return this.deregister(callback)
        }

        // add has callback function
        gameObject["has" + name] = (callback) => {
            return this.has(callback)
        }
    }
}