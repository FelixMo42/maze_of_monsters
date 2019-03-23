export default class Vec2 {
    /**
     * 
     * @param {number} a 
     * @param {number} b 
     * @param {() => null} func 
     */
    static forEach(a, b, func) {
        for (var x = a.x; x <= b.x; x++) {
            for (var y = a.y; y <= b.y; y++) {
                func(new Vec2(x, y))
            }
        }
    }

    /// system functions ///

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")"
    }

    /// x/y getters/setters ///

    /**
     * 
     */
    getX() {
        return this.x
    }

    /**
     * 
     * @param {number} x 
     */
    setX(x) {
        this.x = x
    }

    /**
     * 
     */
    getY() {
        return this.y
    }

    /**
     * 
     * @param {number} y 
     */
    setY(y) {
        this.y = y
    }

    /// ///

    distanceFrom(postion) {
        return Math.sqrt(
            (this.getX() - postion.getY()) ** 2 +
            (this.getY() - postion.getY()) ** 2
        )
    }
}