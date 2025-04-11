export function Tab(props: { name: string, children }) {
    return <div style={{
        paddingTop: "10px",
        display: "flex",
		gap: "10px",
    }}>
        <h1 style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            textAlign: "center"
        }}>{props.name}</h1>
        {props.children}
    </div>
}

export function clone<T>(t: T): T {
	if (typeof t === "object") {
		if (t instanceof Array) {
			return [...t.map(clone)] as T
		} else {
			return Object.fromEntries(
				Object
					.entries(t)
					.map(([k, v]) => [k, clone(v)])
			) as T
		}
	} else {
		return t
	}
}