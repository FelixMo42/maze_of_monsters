import App from './app'
import { endturn } from './logic/inputs'
import { getPawnActions, Item, pawnDoAction } from './logic/pawn'
import { WORLD } from './logic/world'
import { capitalize } from './utils/misc'
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
            m("label", `Selected: ${capitalize(pawn.kind)} Pawn`),
            m("p", `Actions: ${pawn.actionsLeft}/${pawn.actionsFull}`),
            m("p", `Items: ${pawn.items.filter(i => i.amount).map(i => `${i.name} x${i.amount}`).join(", ")}`),
            
            ...getPawnActions(pawn).map(action =>
                button(
                    `${action.name} ${displayItems(action)}`,
                    () => pawnDoAction(pawn, action)
                )
            ),
        )
    })

    document.getElementById("endturn")!.onclick = () => {
        endturn()
    }
}

function displayItems(o: { items: Item[] }) {
    if (o.items.length === 0) return ""
    return `(${o.items.map(i =>
        i.amount < 0 ? `-${-i.amount} ${i.name}` :
            `+${i.amount} ${i.name}`
    ).join(", ")})`
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