export const data = "http://localhost:3001/api"

export default function loader(type) {
    var list = {}

    list.load = async (id) => {
        let response = await fetch(`${data}/${type}/${id}`)
        let config = await response.json()

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