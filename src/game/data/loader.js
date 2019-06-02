export const data = "http://localhost:3001/api"

export default function loader(Type) {
    var type = Type.name.toLowerCase()

    var list = {}

    list.load = async (id) => {
        console.debug(`loading ${data}/${type.toLowerCase()}/${id}`)
        let response = await fetch(`${data}/${type.toLowerCase()}/${id}`)
        let config = await response.json()
        let action = new Type(config)

        list[config.name] = action
        list[id] = action
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