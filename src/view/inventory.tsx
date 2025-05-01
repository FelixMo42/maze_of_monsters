import { signal } from "@preact/signals";

interface Item {
    name: string
    image: string
}

const items = new Map<string, Item>()
const items_signal = signal(0)

items.set("head", {
    name: "Mask",
    image: "./face.png"
})

items.set("#1", {
    name: "Pike",
    image: "./pike.png"
})

export function ItemSlot({ id }: { id: string }) {
    items_signal.value

    console.log("RERENDER")

    return <div
        style={{
            width: "100px",
            height: "100px",
            borderRadius: "5px",
            ...(id.startsWith("#") ? {
                backgroundColor: "white"
            } : {
                border: `1px solid white`,
            })
        }}
        onDrop={(e) => {
            e.preventDefault()
            if (!items.has(id)) {
                const fromId = e.dataTransfer.getData("text/plain")
                const item = items.get(fromId)
                items.delete(fromId)
                items.set(id, item)
                items_signal.value += 1
            }
        }}
        onDragOver={(e) => e.preventDefault()}
    >
        {items.has(id) && <Item item={items.get(id)} id={id} /> }
    </div>
}

function Item({ item, id }: {item: Item, id: string}) {
    return <div
        style={{
            width: "100px",
            height: "100px",
            border: "1px solid white",
            backgroundColor: "white",
            backgroundImage: `url("${item.image}")`,
            backgroundSize: "contain",
            backgroundPosition: 'center',
            backgroundRepeat: "no-repeat",
            borderRadius: "5px",
        }}
        draggable
        onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", id)
            e.dataTransfer.dropEffect = "move"
        }}
    ></div>
}

const rowStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
}

export function Inventory() {
    return <div>
        <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
            <div style={{
                backgroundImage: `url("./peter.png")`,
                width: "120px",
                height: "450px",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderTopLeftRadius: "5px",
                borderBottomLeftRadius: "5px",
                padding: "10px",
                ...rowStyle
            }}>
                <ItemSlot id="head" />
                <ItemSlot id="chest" />
                <ItemSlot id="legs" />
                <ItemSlot id="feet" />
            </div>
            <div style={{
                backgroundColor: "lightgrey",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: "10px",
                flex: 1,
                borderTopRightRadius: "5px",
                borderBottomRightRadius: "5px",
            }}>
                {Array(5).fill(0).map((_, x) =>
                    <div style={rowStyle}>
                        {Array(4).fill(0).map((_, y) => <ItemSlot id={`#${x * 5 + y}`} />)}
                    </div>
                )}
            </div>
        </div>
    </div>
}
