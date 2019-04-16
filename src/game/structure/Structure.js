import GameObject from "../object/GameObject";
import NodeComponent from "../object/NodeComponent";
import Draw from "../util/Draw";

export default class extends GameObject.uses(
    NodeComponent
) {
    constructor(config={}) {
        super(config)

        this.addVariable({
            name: "name"
        })

        this.addVariable({
            name: "color",
            default: "black"
        })

        this.addVariable({
            name: "walkable",
            default: false,
            getterName: "isWalkable"
        })
    }

    draw() {
        Draw.rectangle({
            position: this.getPosition(),
            fill: this.getColor(true),
            //outline: "black"
        })
    }
}