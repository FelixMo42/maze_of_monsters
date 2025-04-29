import { render } from 'preact';

import './style.css';

import { Combat } from './tabs/combat';
import { Inventory } from './tabs/inventory';

export function App() {
	return <main>
		<Combat />
	</main>
}

render(<App />, document.body)
