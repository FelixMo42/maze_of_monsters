import Player from "../player/Player"
import Skill from "../skill/Skill"
import Action from "../action/Action"
import Item from "../item/Item"
import Map from "../map/Map"
import Tile from "../tile/Tile"
import Structure from "../structure/Structure"

import skills from "../skill/skills"
import players from "../player/players"
import items from "../item/items"
import maps from "../map/maps"
import structures from "../structure/structures"
import actions from "../action/actions"
import tiles from "../tile/tiles"

export const source = "http://localhost:3001/api"

export const loaderTypes = {
    Player,
    Skill,
    Action,
    Item,
    Map,
    Structure,
    Tile
}

export const loaderFuncs = {

}

export const loaders = {
    Player : players,
    Skill : skills,
    Action : actions,
    Item : items,
    Map : maps,
    Structure : structures,
    Tile : tiles
}

export default function loader(type) {
    var list = {}

    list.load = async (id) => {
        let response = await fetch(`${source}/${type}/${id}`)
        let text = await response.text()

        console.log(text)

        let config = JSON.parse(text, (key, value) => {
            if (!(value instanceof Object)) { return value }

            if ("@type" in value) {
                if ("id" in value) {
                    loaders[value["@type"]].load(value["id"])
                }

                return new loaderTypes[value["@type"]](value)
            }

            if ("@func" in value) {
                return loaderFuncs[value["@func"]](value)
            }

            return value
        })

        list[config.name] = config
        list[id] = config

        return config
    }

    return new Proxy(list, {
        get(list, name) {
            if (!(name in list)) {
                throw Error(`${type} ${name} does not exist!`)
            }

            return list[name]
        }
    })
}