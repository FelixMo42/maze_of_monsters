import { game } from "../Game";
import Vec2 from "./Vec2";

export default class {
    /// getters ///

    static toGlobal(num) {
        return num * game.getScale()
    }

    /// drawing functions ///

    /**
     * 
     * @param {*} opts 
     */
    static rectangle(opts) {
        var ctx = game.getContext(opts.layer)
        ctx.save()
    
        var x = opts.position.getX()
        var y = opts.position.getY()

        if ("fill" in opts) {
            ctx.fillStyle = opts.fill
            ctx.fillRect(
                x * game.getScale(),
                y * game.getScale(),
                (opts.width || 1) * game.getScale(),
                (opts.height || 1) * game.getScale()
            )
        }

        if ("outline" in opts) {
            ctx.strokeStyle = opts.outline
            ctx.strokeRect(
                x * game.getScale(),
                y * game.getScale(),
                (opts.width || 1) * game.getScale(),
                (opts.height || 1) * game.getScale()
            )
        }

        ctx.restore()
    }

    /**
     * 
     * @param {*} opts 
     */
    static circle(opts) {
        var ctx = game.getContext(opts.layer)
        ctx.save()

        ctx.beginPath();

        ctx.arc(
            this.toGlobal(opts.position.getX() + .5),
            this.toGlobal(opts.position.getY() + .5),
            this.toGlobal(opts.radius || 1) / 2,
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
        var ctx = game.getContext(opts.layer)
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
        var ctx = game.getContext(opts.layer)
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
        var ctx = game.getContext(opts.layer)
        ctx.save()
        ctx.beginPath()
        
        ctx.translate(
            this.toGlobal(opts.position.getX()),
            this.toGlobal(opts.position.getY())
        )



        let size = opts.size || new Vec2(1,1)

        if (opts.icon) {
            ctx.arc(
                this.toGlobal(.5),
                this.toGlobal(.5),
                this.toGlobal(1) / 2,
                0, 2*Math.PI
            )
            ctx.fill()
            ctx.clip()
        }

        ctx.drawImage(
            opts.image,
            0, 0,
            this.toGlobal(size.getX()),
            this.toGlobal(size.getY())
        )

        ctx.closePath()
        ctx.restore()
    }
}