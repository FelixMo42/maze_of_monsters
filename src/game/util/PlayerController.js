import React from "react"

export default class extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}

        for (var player of props.players) {
            player.registerStartTurnCallback(
                (player) => this.setState(this.onStartTurnCallback)
            )

            player.registerEndTurnCallback(
                (player) => this.setState(this.onEndTurnCallback)
            )
        }
    }

    onStartTurnCallback(player) {
        this.setState({player: player})
    }

    onEndTurnCallback(player) {
        this.setState({player: undefined})
    }

    render() {
        return (
            <div>
                {this.state.player ?
                    <input type="button" value="action" />
                :
                    "not your turn :("
                }
            </div>
        )
    }
}