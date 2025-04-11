import { render } from 'preact';

import './style.css';
import { Combat } from './combat';
import { Inventory } from './inventory';

export function App() {
	return <main>
		<Combat />
        <Inventory />
	</main>
}

render(<App />, document.body)
