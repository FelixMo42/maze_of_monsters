import Game from "../Game";

export default class {
    static getContext() {
        return Game.getInstance().graphics
    }

    /**
     * 
     * @param {*} opts 
     */
    static rectangle(opts) {
        var ctx = this.getContext()

        if ("fill" in opts) {
            ctx.fillStyle = opts.fill
            ctx.fillRect(
                opts.x * ctx.size, opts.y * ctx.size,
                (opts.width || 1) * ctx.size, (opts.height || 1) * ctx.size
            )
        }

        if ("outline" in opts) {
            ctx.strokeStyle = opts.outline
            ctx.strokeRect(
                opts.x * ctx.size, opts.y * ctx.size,
                (opts.width || 1) * ctx.size, (opts.height || 1) * ctx.size
            )
        }
    }

    static circle(opts) {
        var ctx = this.getContext()

        ctx.beginPath();

        var radius = ctx.size / 2
        ctx.arc(
            opts.x * ctx.size + radius, // x
            opts.y * ctx.size + radius, // y
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
}