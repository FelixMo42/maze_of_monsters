export interface User {
    name: string
    items: Item[]
}

export interface Item {
    name: "wood" | "food",
    amount: number,
}

export function Item(name: ItemName, amount: number = 1): Item {
    return { name, amount }
}

export type ItemName = Item["name"]

export function getItemAmount(user: User, name: ItemName) {
    return getUserItem(user, name)?.amount || 0
}

export function getUserItem(user: User, name: ItemName) {
    return user.items.find((item) => item.name === name)
}

export function updateUserItem(user: User, item: Item) {
    if (getUserItem(user, item.name)) {
        getUserItem(user, item.name)!.amount += item.amount
    } else {
        user.items.push(item)
    }
}
