import { signal } from "@preact/signals"
import { Tab } from "../utils"
import { Action, Character, Cleric, context, dragData, Enemy, fire, Paladin, Player, Warrior } from "../characters"

interface State {
    room: number,
    players: Player[],
    enemies: Enemy[],
}

class Goblin extends Character {
    name: string = "goblin"
    hp: number = 100

    constructor(number: number) {
        super()

        this.name = `goblin #${number}`
        this.hp = 100 + 10 * (number - 1)
    }
}

function init<T extends Character>(...arr: T[]): T[] {
    arr.forEach(char => char.init())
    return arr
}

export const STATE = signal<State>({
    room: 1,
    players: init(new Paladin(), new Warrior(), new Cleric()),
    enemies: init(new Goblin(1)),
})

function selectRandom<T>(arr: T[], filter: (t: T) => boolean): T {
    const a = arr.filter(filter)
    return a[Math.floor(Math.random() * a.length)]
}

function ai() {
    const target = selectRandom(STATE.value.players, (t) => t.hp > 0)
    target.hurt(10)
}

function HPBar(params: { hp: number, maxHP: number }) {
    const p = `${Math.floor(params.hp / params.maxHP * 100)}%`
    const fg = `#C08081`
    const bg = `rgba(0, 0, 0, 0.2)`
    return <div class="bar" style={{
        background: `linear-gradient(to right, ${fg} ${p}, ${bg} ${p})`
    }}>HP: {params.hp}/{params.maxHP}</div>
}

export function apply(source: Character, action: Action, target: Character) {
    action.effect(target)

    ai()

    fire({
        kind: "END_TURN",
        action,
        target,
        source,
    })

    STATE.value = { ...STATE.value }
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
    return <section style={{ backgroundColor: "green" }}>
        <h1 style={{ textAlign: "center" }}>{target.name}</h1>
        <HPBar hp={target.hp} maxHP={target.maxHp} />
    </section>
}

export function Combat() {
	const state = STATE.value

    if (state.enemies[0].hp <= 0) {
        STATE.value.room += 1
        STATE.value.enemies = init(new Goblin(STATE.value.room))
    }

	return <div>
        <div style={{ gap: "10px", display: "flex", flexDirection: "column", flex: 1, }}>
            <div style={{ flex: 1 }}>
                {state.enemies.map(target => <Target target={target} />)}
            </div>

            <div style={{ flex: 1, display: "flex", gap: "10px" }}>
                {state.players.map(player => <PlayerView player={player} />)}
            </div>
        </div>
    </div>
}
