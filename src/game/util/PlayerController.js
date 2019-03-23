import React from "react"

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
    }

    /**
     * 
     * @param {*} player 
     */
    onStartTurnCallback(player) {
        this.setState({player: player})
    }

    /**
     * 
     * @param {*} player 
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

    playerUi() {
        return (
            <div>
                <input type="button" value="actions" />
            </div>
        )
    }
}