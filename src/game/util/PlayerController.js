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

            player.registerUpdateStateCallback(
                () => {this.forceUpdate()}
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
            this.state.action.use(Draw.getMousePos())
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
                    <div>
                        actions: 
                        {
                            this.state.player.getActions().map(action =>
                                <input
                                    type="button"
                                    style={
                                        action === this.state.action ? {
                                            backgroundColor: "blue"
                                        } : {}
                                    }
                                    key={action.getKey(true)}
                                    value={action.getName(true)}
                                    onClick={() => {this.selectAction(action)}}
                                />
                            )
                        }
                        <input type="button" value="end turn" onClick={() => {
                            this.state.player.endTurn()
                        }}/>
                    </div>
                    <div>
                        items: 
                        {
                            this.state.player.getItems().map(item =>
                                <input
                                    type="button"
                                    key={item.getKey(true)}
                                    value={item.getName(true)}
                                />
                            )
                        }
                    </div>
                    <div>
                        moves: 
                        {
                            Object.keys(this.state.player.getMoves(true)).map(move =>
                                <input
                                    key={move}
                                    type="button"
                                    value={move + " : " + this.state.player.getMove(move, true)}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}