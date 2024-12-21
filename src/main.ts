import App from './app'
import { GameView } from './views/GameView'

async function main() {
    const app = await App.createAndInit("black")
    app.viewport.addChild(GameView())
    app.viewport.fit() 
}

main()