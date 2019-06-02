import loader from "./util/loader"
import maps from "./map/maps"
import players from "./player/players"

export const settings = loader("settings")

export async function initialize() {
    console.debug("------ loading ------")

    let game = await settings.load("game")
    console.debug("loaded game config")

    await Promise.all([
        maps.load(game.startingMap).then(map => {
            console.debug("loaded main map") 
        }),
        players.load(game.playerCharacter).then(player => {
            console.debug("loaded main player")
        })
    ])

    console.debug("--- done  loading ---")
}