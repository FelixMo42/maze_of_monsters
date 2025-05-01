import { signal } from "@preact/signals"
import { Cleric, Paladin, Player, Warrior } from "../core/players"
import { Goblin, Enemy, kickOpenTheDoor } from "../core/enemies"
import { init } from "../core/characters"
import { context, dragData } from "../core/actions"
import { ItemSlot } from "./inventory"

interface State {
    room: number,
    players: Player[],
    enemies: Enemy[],
}

export const STATE = signal<State>({
    room: 1,
    players: init(new Paladin(), new Warrior(), new Cleric()),
    enemies: init(new Goblin(1)),
})

function HPBar(params: { hp: number, maxHP: number }) {
    const p = `${Math.floor(params.hp / params.maxHP * 100)}%`
    const fg = `#C08081`
    const bg = `rgba(0, 0, 0, 0.2)`
    return <div class="bar" style={{
        background: `linear-gradient(to right, ${fg} ${p}, ${bg} ${p})`
    }}>HP: {params.hp}/{params.maxHP}</div>
}

function PlayerView({player}: {player: Player}) {
    context.source = player

    if (player.hp <= 0) {
        return <div
            style={{ height: "100%", flex: 1 }}
            onDrop={(e) => {
                e.preventDefault()
                dragData.value(player)
            }}
            onDragOver={(e) => e.preventDefault()}
        >
            <h1 style={{ textAlign: "center" }}>{player.name}</h1>
            <HPBar hp={player.hp} maxHP={player.maxHp} />
            <p><b>DEAD</b></p>
        </div>
    }

	return <div
        style={{ height: "100%", flex: 1 }}
        onDrop={(e) => {
            e.preventDefault()
            dragData.value(player)
        }}
        onDragOver={(e) => e.preventDefault()}
    >
		<h1 style={{ textAlign: "center" }}>{player.name}</h1>
		<HPBar hp={player.hp} maxHP={player.maxHp} />
		{player.actions()}
	</div>
}

function Target({target}: { target: Enemy }) {
    return <div style={{ backgroundColor: "green",  textAlign: "center", color: "white", padding: "10px", borderRadius: "5px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{flex: 1}}>
            {target.hp > 0
                ? <h2>"A journy of a thousand miles begins with a single step." <span style={{ fontWeight: "bold", fontStyle: "italics" }}>-Goblin #1</span></h2>
                : <div>
                    <h2>Victory!</h2>
                    <div>
                        <ItemSlot id="reward1" />
                    </div>
                    <button onClick={kickOpenTheDoor}>Kick open the door</button>
                </div>
            }
        </div>
        <HPBar hp={target.hp} maxHP={target.maxHp} />
    </div>
}

export function Combat() {
	const state = STATE.value

	return <div style={{ flex: 1, gap: "10px", display: "flex", flexDirection: "column" }}>
        {state.enemies.map(target => <Target target={target} />)}

        <div style={{ display: "flex", gap: "10px", height: "200px" }}>
            {state.players.map(player => <PlayerView player={player} />)}
        </div>
    </div>
}
