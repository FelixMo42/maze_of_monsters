import App from './app'
import { endturn } from './logic/inputs'
import { WORLD } from './logic/world'
import { use } from './utils/use'
import { GameView } from './views/GameView'

async function main() {
    // Pixi.js stuff
    const app = await App.createAndInit("black")
    app.viewport.addChild(GameView())
    app.viewport.fit() 

    // HTML stuff
    const el = document.getElementById("selected")
    use(w => w.pawns[w.selectedPawn].actionsLeft, () => {
        const pawn = WORLD.pawns[WORLD.selectedPawn]
        el?.replaceChildren(
            m("h1", "Selected: Pawn"),
            m("p", `Actions: ${pawn.actionsLeft}/${pawn.actionsFull}`)
        )
    })

    document.getElementById("endturn")!.onclick = () => {
        endturn()
    }
}

function m(tag: string, ...children: (string | HTMLElement)[]) {
    const el = document.createElement(tag)
    el.append(...children)
    return el
}

main()