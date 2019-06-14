import loader from "./util/loader"
import Map from "./map/Map";
import Player from "./player/Player";
import Vec2 from "./util/Vec2";

export const settings = loader("settings")

export async function initialize() {
    console.debug("--- loading data ---")

    await Promise.all([
        settings.load("game")
    ])

    let players = [
        new Player({
            ...settings.game.playerCharacter
        })
    ]

    let map = new Map(settings.game.startingMap)

    map.addPlayer(players[0], new Vec2(1,1))

    console.debug("--- done loading ---")

    return {map, players}
}