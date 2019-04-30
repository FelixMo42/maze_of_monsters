import React from "react"
import Game from "../Game";
import Draw from "./Draw";
import Pather from "./Pather";

export default class extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            viewMode: "items"
        }

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
            fill: "rgba(255,255,255,.5)",
            //outline: "black",
        })

        if (this.state.action && this.state.player) {
            if (this.state.action.getName(true) === "Move") {
                return this.drawMoveActionOverlay()
            }
            Draw.circle({
                position: this.state.player.getPosition(),
                radius: this.state.action.getRange(),
                outline: "black"
            })
        }
    }

    drawMoveActionOverlay() {
        if (
            this.mousePos !== Draw.getMousePos() &&
            this.state.player.getMap().isInBounds(Draw.getMousePos())
        ) {
            this.mousePos = Draw.getMousePos()
            var pather = new Pather(this.state.player.getMap())
            this.path = pather.path(this.state.player.getPosition(), this.mousePos)
        }

        Draw.line({
            outline: "black",
            points: [
                this.state.player.getPosition(),
                ...this.path
            ],
        })
    }

    activateAction() {
        if (this.state.action) {
            if (this.state.action.getName() === "Move") {
                while (this.path.length > 0) {
                    let sucses = this.state.action.use(this.path.shift())
                    if (!sucses) {
                        break
                    }
                }
            } else {
                this.state.action.use(Draw.getMousePos())
            }
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
        return (
            <div className="PlayerController">
                { this.state.player ? this.renderActions() : "" }
                <div style={{
                    position: "fixed",
                    bottom: "0px",
                    backgroundColor: "#212121",
                    width: "200px",
                    border: "solid black"
                }}>
                    { this.renderPlayers() }
                </div>
                {this.state.viewed ? this.renderViewed() : "" }
            </div>
        )
    }

    renderViewed() {
        var border = 17
        return (
            <div style={{
                position: "absolute",
                top: border + "px",
                bottom: border + "px",
                left: border + "px",
                right: border + "px",
                border: "solid black",
                backgroundColor: "white"
            }}>
                <div>
                    <input type="button" value="items" onClick={() => {
                        this.setState({
                            viewMode: "items"
                        })
                    }}/>
                    <input type="button" value="actions" onClick={() => {
                        this.setState({
                            viewMode: "actions"
                        })
                    }}/>
                    <input type="button" value="stats" onClick={() => {
                        this.setState({
                            viewMode: "stats"
                        })
                    }}/>
                    <input type="button" value="X" onClick={() => {
                        this.setState({
                            viewed: undefined
                        })
                    }}/>
                </div>
                { this.state.viewMode === "items" ? this.renderItemsView()  : "" }
                { this.state.viewMode === "actions" ? "N/A"  : "" }
                { this.state.viewMode === "stats" ? "N/A"  : "" }
            </div>
        )
    }

    renderItemsView() {
        return (
            <div>
                <h3 style={{marginLeft: "100px"}}>Inventory</h3>
                <ul>
                    { this.state.viewed.getItems().map((item) => {
                        return this.renderItem(item)
                    }) }
                </ul>

                {
                    Object.values(this.state.viewed.getSlots()).map((slot) => 
                        <div key={slot.getKey()}>
                            <h3 style={{marginLeft: "100px"}}>{slot.getName()}</h3>
                            <ul>
                                { slot.getItems().map((item) => {
                                    return this.renderItem(item)
                                }) }
                            </ul>
                        </div>
                    )
                }

                <hr/>
                
                { this.state.item ?
                    <div style={{
                        padding: "5px"
                    }}>
                        <div style={{
                            textAlign: "center"
                        }}>
                            {this.state.item.getName(true)}
                        </div>

                        <br />

                        description: {this.state.item.getDescription()}
                    </div>
                : ""}
            </div>
        )
    }

    renderItem(item) {
        return (
            <li key={item.getKey()}>
                <span onClick={()=>{
                    this.setState({item: item})
                }}> { item.getName() } </span> { " - " }
                { item.isEquipable(true) ? (
                    item.isEquiped(true) ? 
                        <input
                            style={{backgroundColor: "blue"}}
                            type="button"
                            value="U"
                            onClick={()=>{
                                item.unequip()
                            }}
                        />
                    :
                        <input
                            type="button"
                            value="E"
                            onClick={()=>{
                                item.equip()
                            }}
                        />
                ) : ""}
                <input type="button" value="D" onClick={()=>{
                    item.drop()
                }}/>
            </li>
        )
    }

    renderActions() {
        return (
            <div>
                { this.state.player.getActions().map(action => {
                    return this.renderAction(action)
                }) }
                <input type="button" value="End Turn" onClick={() => {
                    this.state.player.endTurn()
                }}/>
            </div>
        )
    }

    renderAction(action) {
        return (
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

    renderPlayers() {
        return this.props.players.map( (player) => this.renderPlayer(player) )
    }

    renderPlayer(player) {
        return (
            <div
                style={{
                    padding: "5px",
                    overflow: "auto",
                    color: "white",
                }}
                key={ player.getKey() }
                onClick={() => {
                    this.setState({
                        viewed: player
                    })
                }}
            >
                { this.renderPlayerIcon(player) }
                { player.getName(true) }
                <hr style={{
                    marginTop: "2px",
                    marginBottom: "2px",
                }} />
                { player.getHP(true) } / { player.getMaxHP(true) } hp
                <br />
                { player.getMove("main", true) } / { player.getMaxMove("main", true) } moves
            </div>
        )
    }

    renderPlayerIcon(player) {
        return (
            <img
                style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "white",
                    outlineColor: "black",
                    marginRight: "5px",
                    float: "left"
                }} 
                alt=""
            />
        )
    }

    renderSelectedPlayer() {
        return (
            <div>
                <input type="button" value="action" />
                <input type="button" value="items" />
            </div>
        )
    }

    /**
     * 
     * @param {Action} action 
     */
    selectAction(action) {
        this.setState({action: action})
    }
}