import App from './app'
import { endturn } from './logic/inputs'
import { chopwood } from './logic/pawn'
import { update, WORLD } from './logic/world'
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
            m("label", "Selected: Pawn"),
            m("p", `Actions: ${pawn.actionsLeft}/${pawn.actionsFull}`),
            m("p", `Items: ${pawn.items.map(i => `${i.name} x${i.amount}`).join(", ")}`),
            button(`Chop Wood (+1 wood)`, () => {
                update(() => chopwood(pawn))
            })
        )
    })

    document.getElementById("endturn")!.onclick = () => {
        endturn()
    }
}

function button(text: string, onclick: () => void) {
    const el = m("button", text)
    el.onclick = onclick
    return el
}

function m(tag: string, ...children: (string | HTMLElement)[]) {
    const el = document.createElement(tag)
    el.append(...children)
    return el
}

main()