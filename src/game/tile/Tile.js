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

    /**
     * 
     * @param {TileEffect} effect 
     */
    affect(effect) {

    }

    /**
     * 
     * @param {number} dt 
     */
    draw(dt) {
        Draw.rectangle({
            position: this.getPosition(),
            fill: this.getColor(true),
            //outline: "black"
        })
    }
}