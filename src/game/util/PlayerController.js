import React from "react"
import Game from "../Game";
import Draw from "./Draw";

export default class extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}

        for (var player of props.players) {
            player.registerStartTurnCallback(
                (player) => {this.onStartTurnCallback(player)}
            )

            player.registerEndTurnCallback(
                (player) => {this.onEndTurnCallback(player)}
            )
        }

        Game.getInstance().registerDrawCallback(() => {this.drawActionOverlay()})
        Game.getInstance().registerMouseDownCallback(() => {this.activateAction()})
    }

    drawActionOverlay() {
        Draw.rectangle({
            position: Draw.getMousePos(),
            //fill: "rgba(255,255,255,.5)",
            outline: "black",
        })
    }

    activateAction() {
        if (this.state.action) {
            this.state.action.call(Draw.getMousePos())
        }
    }

    /**
     * 
     * @param {Player} player 
     */
    onStartTurnCallback(player) {
        this.setState({player: player})
    }

    /**
     * 
     * @param {Player} player 
     */
    onEndTurnCallback(player) {
        this.setState({player: undefined})
    }

    /**
     * 
     */
    render() {
        if (this.state.player) {
            return this.playerUi()
        } else {
            return <p>not your turn :(</p>
        }
    }

    /**
     * 
     * @param {Action} action 
     */
    selectAction(action) {
        this.setState({action: action})
    }

    /**
     * 
     */
    playerUi() {
        return (
            <div>
                <div>
                    <input type="button" value="actions" />
                    <div>
                        {
                            this.state.player.getActions().map(action =>
                                <span key={action.getKey(true)}><input
                                    type="button"
                                    style={
                                        action === this.state.action ? {
                                            backgroundColor: "blue"
                                        } : {}
                                    }
                                    value={action.getName(true)}
                                    onClick={() => {this.selectAction(action)}}
                                /><br/></span>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}