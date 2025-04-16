import { Tab } from "./utils";

export function Inventory() {
    return <Tab name="INVENTORY">
        <div style={{
            backgroundImage: `url("./peter.png")`,
            width: "120px",
            height: "450px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "5px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }}>
            <div style={{
                width: "100px",
                height: "100px",
                border: "1px solid white",
                backgroundColor: "white",
                backgroundImage: `url("./face.png")`,
                backgroundSize: "contain",
                backgroundPosition: 'center',
                backgroundRepeat: "no-repeat"
            }}></div>
            <div style={{
                width: "100px",
                height: "100px",
                border: "1px solid white",
            }}></div>
            <div style={{
                width: "100px",
                height: "100px",
                border: "1px solid white",
            }}></div>
            <div style={{
                width: "100px",
                height: "100px",
                border: "1px solid white",
            }}></div>
        </div>
        <p>GP: 7</p>
    </Tab>
}
