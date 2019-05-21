import Game from "../Game";
import Vec2 from "./Vec2";

export default class {
    /// getters ///

    static getContext(layer) {
        return Game.getInstance().context
    }

    static getScale(layer) {
        return Game.getInstance().scale
    }

    /**
     * 
     */
    static getMousePos() {
        return Game.getInstance().mousePos
    }

    static toGlobal(num) {
        return num * this.getScale()
    }

    /// drawing functions ///

    /**
     * 
     * @param {*} opts 
     */
    static rectangle(opts) {
        var ctx = this.getContext(opts.layer)
        ctx.save()
    
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

        ctx.restore()
    }

    /**
     * 
     * @param {*} opts 
     */
    static circle(opts) {
        var ctx = this.getContext(opts.layer)
        ctx.save()

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

        ctx.closePath()
        ctx.restore()
    }

    static line(opts) {
        var ctx = this.getContext(opts.layer)
        ctx.save()

        ctx.beginPath()

        ctx.moveTo(
            this.toGlobal(opts.points[0].getX() + .5),
            this.toGlobal(opts.points[0].getY() + .5)
        )

        for (let i = 1; i < opts.points.length; i++) {
            ctx.lineTo(
                this.toGlobal(opts.points[i].getX() + .5),
                this.toGlobal(opts.points[i].getY() + .5)
            )
        }

        ctx.lineWidth = opts.lineWidth || 5;

        ctx.stroke()

        ctx.closePath()
        ctx.restore()
    }

    static text(opts) {
        var ctx = this.getContext(opts.layer)
        ctx.save()

        ctx.fillStyle = opts.fill || "black"
        ctx.textAlign = opts.align || "center"

        ctx.font = "20px Comic Sans MS"

        ctx.fillText(
            opts.text,
            this.toGlobal(opts.position.getX()),
            this.toGlobal(opts.position.getY())
        )

        ctx.restore()
    }

    static image(opts) {
        var ctx = this.getContext(opts.layer)
        ctx.save()

        let size = opts.size || new Vec2(1,1)

        ctx.drawImage(
            opts.image,
            this.toGlobal(opts.position.getX()),
            this.toGlobal(opts.position.getY()),
            this.toGlobal(size.getX()),
            this.toGlobal(size.getY())
        )

        ctx.restore()
    }
}