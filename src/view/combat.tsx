import { signal } from "@preact/signals"
import { Cleric, Paladin, Player, Warrior } from "../core/players"
import { Enemy, Goblin, kickOpenTheDoor } from "../core/enemies"
import { init } from "../core/characters"
import { context } from "../core/actions"
import { ItemSlot } from "./inventory"
import { isOutOfNewItems } from "../core/items"
import { getDragData } from "../core/drag"

///////////
// STATE //
///////////

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

///////////////////////////
// CAN YOU PASS THE BAR? //
///////////////////////////

interface BarProps {
    hp: number
    maxHP: number
    fg?: string
    bg?: string
}

function HPBar(props: BarProps) {
    const p = `${Math.floor(props.hp / props.maxHP * 100)}%`

    const fg = props.fg ?? `#C08081`
    const bg = props.bg ?? `rgba(0, 0, 0, 0.2)`
    
    const style = {
        background: `linear-gradient(to right, ${fg} ${p}, ${bg} ${p})`
    }

    return <div
        class="bar"
        style={style}
    >HP: {props.hp}/{props.maxHP}</div>
}

/////////////////
// PLAYER VIEW //
/////////////////

function PlayerView({ player }: { player: Player }) {
    context.source = player

	return <div
        style={{ height: "100%", flex: 1 }}
        onDrop={(e) => {
            e.preventDefault()
            getDragData("ACTION_TRIGGER")?.trigger(player)
        }}
        onDragOver={(e) => e.preventDefault()}
    >
		<h1 style={{ textAlign: "center" }}>{player.name}</h1>
		<HPBar hp={player.hp} maxHP={player.maxHp} />
        <PlayerActionsView player={player} />
	</div>
}

function PlayerActionsView({ player }: { player: Player }) {
    if (player.hp <= 0) {
        return <p><b>DEAD</b></p>
    } else {
        return player.actions()
    }
}

////////////////
// ENEMY VIEW //
////////////////

function EnemyView({ enemy }: { enemy: Enemy }) {
    return <div style={{ backgroundColor: "green",  textAlign: "center", color: "white", padding: "10px", borderRadius: "5px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{flex: 1}}>
            {enemy.hp > 0
                ? <EnemyTitleCardView enemy={enemy} />
                : <VictoryView />
            }
        </div>
        <HPBar hp={enemy.hp} maxHP={enemy.maxHp} />
    </div>
}

function EnemyTitleCardView({ enemy }: { enemy: Enemy }) {
    const quote = "A journy of a thousand miles begins with a single step."
    return <h2>{quote} -{enemy.name}</h2>
}

function VictoryView() {
    if (isOutOfNewItems()) {
        return <h2>"You've reached the end of the sidewalk! Draw new items please!!!!!!" -You're loving dom</h2>
    }

    return <div>
        <h2>Victory!</h2>
        <ItemSlot location="reward/0" />
        <button onClick={kickOpenTheDoor}>Kick open the door</button>
    </div>
}

//////////////
// COMBAT!! //
//////////////

export function Combat() {
	const state = STATE.value

	return <div style={{ flex: 1, gap: "10px", display: "flex", flexDirection: "column" }}>
        {state.enemies.map(target => <EnemyView enemy={target} />)}

        <div style={{ display: "flex", gap: "10px", height: "200px" }}>
            {state.players.map(player => <PlayerView player={player} />)}
        </div>
    </div>
}
