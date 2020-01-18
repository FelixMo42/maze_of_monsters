import skills from "../skill/skills"
import players from "../player/players"
import items from "../item/items"
import maps from "../map/maps"
import structures from "../structure/structures"
import actions from "../action/actions"
import tiles from "../tile/tiles"

export const source = "http://localhost:3001/api"

export const loaderTypes = {
}

export const loaderFuncs = {
}

export const loaders = {
    player : players,
    skill : skills,
    action : actions,
    item : items,
    map : maps,
    structure : structures,
    tile : tiles
}

export default function loader(type) {
    var list = {}
    var id = -1

    list.load = async (id) => {
        let response = await fetch(`${source}/${type}/${id}`)
        let text = await response.text()
        let loads = []

        let config = JSON.parse(text, (key, value) => {
            if (!(value instanceof Object)) { return value }

            if ("@class" in value) {
                loads.push( loaders[value["@class"]].load(value["id"]) )
            }

            if ("@type" in value) {
                return new loaderTypes[value["@type"]](value)
            }

            if ("@func" in value) {
                return loaderFuncs[value["@func"]](value)
            }

            return value
        })

        list.register(config)

        await Promise.all(loads)

        console.debug(`done loading ${type}, ${id}`)

        return config
    }

    list.register = (config) => {
        list[config.name] = config
        list[id] = config

        return {"@class": type, "id": id}
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