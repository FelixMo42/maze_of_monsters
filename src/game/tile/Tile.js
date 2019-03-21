import GameObject from "../object/GameObject"
import NodeComponent from "../object/NodeComponent";
import Draw from "../util/Draw";

export default class Tile extends GameObject.uses(NodeComponent) {
    constructor(config={}) {
        super(config)

        this.addVariable({
            name: "color",
            default: "green"
        })
    }

    draw(dt) {
        Draw.rectangle({
            x: this.getX(),
            y: this.getY(),
            fill: this.getColor(true),
            //outline: "black"
        })
    }
}