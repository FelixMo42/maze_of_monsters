import { render } from 'preact';

import './style.css';

import { Combat } from './tabs/combat';
import { Inventory } from './tabs/inventory';
import { Shop } from './tabs/shop';

export function App() {
	return <main>
		<h1 style={{ textAlign: 'center' }}>Hometown</h1>
		<Combat />
        <Inventory />
	</main>
}

render(<App />, document.body)
