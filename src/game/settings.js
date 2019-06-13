import loader from "./util/loader"

export const settings = loader("settings")

export async function initialize() {
    console.debug("------ loading ------")

    let game = await settings.load("game")
    console.debug("loaded game settings")

    console.log(game)

    console.debug("--- done  loading ---")
}