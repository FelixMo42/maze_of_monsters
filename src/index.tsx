import { signal } from "@preact/signals";
import { render } from 'preact';

import './style.css';

function dealDamage(amu: number): Effect {
	return {
		apply: (t) => {
			t.hp -= amu
		}
	}
}

function heal(amu: number): Effect {
	return {
		apply: (t) => {
			t.hp = Math.min(t.hp + amu, t.maxHp)
		}
	}
}

interface Effect {
	apply: (target: Character) => void
}

interface Action {
	name: string
	target: "enemy" | "self"
	effect: Effect
}

interface Character {
	name: string
	hp: number
	maxHp: number
	actions: Action[]
}

interface State {
	players: Character[],
	targets: Character[],
}

type Mode
	= { kind: "normal" }
	| { kind: "target", cb: (target: Character) => void }

const MODE = signal<Mode>({ kind: "normal" });
const STATE = signal<State>({
	players: [{
		name: "Peter",
		hp: 100,
		maxHp: 100,
		actions: [
			{
				name: "KICK ASS",
				target: "enemy",
				effect: dealDamage(10)
			}
		]
	}],
	targets: [{
		name: "Guard",
		hp: 1000,
		maxHp: 1000,
		actions: [],
	}],
})

function ai() {
	dealDamage(30).apply(STATE.value.players[0])
}

function act(action: Action) {
	return () => {
		// apply player action
		if (action.target === "self") {
			action.effect.apply(STATE.value.players[0])
		} else {
			action.effect.apply(STATE.value.targets[0])
		}

		// enemy action
		ai()

		// trigger update
		STATE.value = clone(STATE.value)
	}
}

function HPBar(params: { hp: number, maxHP: number }) {
	const p = `${Math.floor(params.hp / params.maxHP * 100)}%`
	const fg = `#C08081`
	const bg = `rgba(0, 0, 0, 0.2)`
	return <div class="bar" style={{
		background: `linear-gradient(to right, ${fg} ${p}, ${bg} ${p})`
	}}>HP: {params.hp}/{params.maxHP}</div>
}

function Player({player}: {player: Character}) {
	return <section>
		<h1>{player.name}</h1>
		<HPBar hp={player.hp} maxHP={player.maxHp} />
		{player.actions.map(action =>
			<input
				type='button'
				value={action.name}
				onClick={act(action)}
			/>
		)}
			<img src="./assets/face.png"></img>
	</section>
}

function Target({target}: { target: Character }) {
	const mode = MODE.value;

	const backgroundColor = mode.kind == "target" ? "red" : "green"
	const onClick = () => {
		if (mode.kind === "target") {
			mode.cb(target)
		}
	}

	return <section style={{ backgroundColor }} onClick={onClick}>
		<h1>{target.name}</h1>
		<HPBar hp={target.hp} maxHP={target.maxHp} />
		<p>"If you want too ascend <u>The Tower of Gilgamesh</u>, you mush show me your <b><i>POWER</i></b>!!!!!!!!"</p>
		<img src="https://i.imgflip.com/9qcljw.jpg" title="made at imgflip.com"/>
	</section>
}

export function App() {
	const state = STATE.value

	if (state.players[0].hp <= 0) {
		return <main>
			<p>YOU ARE DEAD :(</p>
		</main>
	}

	return <main>
		<div style={{ display: "flex" }}>
			<div style={{ flex: 1 }}>
				{state.players.map(player => <Player player={player} />)}
			</div>

			<div style={{ flex: 1 }}>
				{state.targets.map(target => <Target target={target} />)}
			</div>
		</div>
	</main>
}

render(<App />, document.body)

function clone<T>(t: T): T {
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