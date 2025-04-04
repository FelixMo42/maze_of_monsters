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

interface Effect {
	apply: (target: Character) => void
}

interface Action {
	name: string,
	effect: Effect
}

interface Character {
	name: string
	hp: number
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
		name: "Gorbo",
		hp: 100,
		actions: [
			{
				name: "Attack",
				effect: dealDamage(10)
			}
		]
	}],
	targets: [{
		name: "Rat",
		hp: 20,
		actions: [],
	}],
})

function end() {
	const newState = STATE.value

	newState.players = newState.players.filter((player) => player.hp > 0)
	newState.targets = newState.targets.filter((player) => player.hp > 0)

	console.log(">>", newState.targets.length)

	STATE.value = { ...newState }
}

function act(action: Action) {
	return () => {
		MODE.value = {
			kind: "target",
			cb: (target) => {
				// reset target mode
				MODE.value = { kind: "normal" }

				// apply effect
				action.effect.apply(target)

				// end of turn things
				end()
			}
		}
	}
}

function Player({player}: {player: Character}) {
	return <section>
		<h1>{player.name}</h1>
		<div>HP: {player.hp}</div>
		{player.actions.map(action =>
			<input
				type='button'
				value={action.name}
				onClick={act(action)}
			/>
		)}
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
		{target.hp}
	</section>
}

export function App() {
	const state = STATE.value

	return (
		<main>
			<div style={{ display: "flex" }}>
				<div style={{ flex: 1 }}>
					{state.players.map(player => <Player player={player} />)}
				</div>

				<div style={{ flex: 1 }}>
					{state.targets.map(target => <Target target={target} />)}
				</div>
			</div>
		</main>
	)
}

render(<App />, document.body)
