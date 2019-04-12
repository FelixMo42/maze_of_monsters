import Game from "../Game";

export default class {
    static getContext(layer) {
        return Game.getInstance().context
    }

    static getScale(layer) {
        return Game.getInstance().scale
    }

    /**
     * 
     * @param {*} opts 
     */
    static rectangle(opts) {
        var ctx = this.getContext(opts.layer)
    
        var x = opts.position.getX()
        var y = opts.position.getY()

        if ("fill" in opts) {
            ctx.fillStyle = opts.fill
            ctx.fillRect(
                x * this.getScale(),
                y * this.getScale(),
                (opts.width || 1) * this.getScale(),
                (opts.height || 1) * this.getScale()
            )
        }

        if ("outline" in opts) {
            ctx.strokeStyle = opts.outline
            ctx.strokeRect(
                x * this.getScale(),
                y * this.getScale(),
                (opts.width || 1) * this.getScale(),
                (opts.height || 1) * this.getScale()
            )
        }
    }

    /**
     * 
     * @param {*} opts 
     */
    static circle(opts) {
        var ctx = this.getContext(opts.layer)

        var x = opts.position.getX()
        var y = opts.position.getY()

        var radius = this.getScale() / 2 * ("radius" in opts ? (opts.radius * 2 + 1) : 1)

        ctx.beginPath();

        ctx.arc(
            (x + .5) * this.getScale(),// + radius, // x
            (y + .5) * this.getScale(),// + radius, // y
            radius, // radius
            0, // start angle
            2 * Math.PI // end angle
        );

        if ("fill" in opts) {
            ctx.fillStyle = opts.fill
            ctx.fill();
        }

        if ("outline" in opts) {
            ctx.strokeStyle = opts.outline
            ctx.stroke()
        }

        ctx.closePath();
    }

    /**
     * 
     */
    static getMousePos() {
        return Game.getInstance().mousePos
    }
}