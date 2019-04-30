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

    equals(a) {
        return this.getX() === a.getX() && this.getY() === a.getY()
    }

    distanceFrom(postion) {
        return Math.sqrt(
            (this.getX() - postion.getX()) ** 2 +
            (this.getY() - postion.getY()) ** 2
        )
    }

    subtract(a) {
        return new Vec2(
            this.getX() - a.getX(),
            this.getY() - a.getY()

        )
    }

    add(a) {
        return new Vec2(
            this.getX() + a.getX(),
            this.getY() + a.getY()

        )
    }

    sign() {
        return new Vec2(
            Math.sign(this.getX()),
            Math.sign(this.getY())
        )
    }

    clone() {
        return new Vec2(
            this.x,
            this.y
        )
    }
}