import { getItem, type Item } from "../core/items";
import { STATE } from "./combat";

export function ItemSlot({ location }: { location: string }) {
    // Listen to rerenders
    STATE.value

    // Get the item in the slot if there is one
    const item = getItem(location)

    return <div style={{
        width: "100px",
        height: "100px",
    }}>
        {item && <Item
            item={item}
            location={location}
        /> }
    </div>
}

function Item({ item, location }: {item: Item, location: string}) {
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
            e.dataTransfer.setData("text/plain", location)
            e.dataTransfer.dropEffect = "move"
        }}
    ></div>
}
