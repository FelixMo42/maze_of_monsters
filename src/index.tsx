import { render } from 'preact';

import './style.css';

import { Combat } from './view/combat';

export function App() {
	return <main>
		<Combat />
	</main>
}

render(<App />, document.body)
