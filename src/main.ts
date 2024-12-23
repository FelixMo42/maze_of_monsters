import App from './app'
import { endturn } from './logic/inputs'
import { Item } from './logic/item'
import { getPawnActions, Pawn, pawnDoAction } from './logic/pawn'
import { capitalize } from './utils/misc'
import { use } from './utils/use'
import { GameView } from './views/GameView'

async function main() {
    // Pixi.js stuff
    const app = await App.createAndInit("black")
    app.viewport.addChild(GameView())
    app.viewport.fit() 

    // HTML stuff
    SelectedHtml()
    ResourcesHtml()

    document.getElementById("endturn")!.onclick = () => {
        endturn()
    }
}

function ResourcesHtml() {
    const el = document.getElementById("items")!
    use(w => w.users[0], (user) => {
        el.replaceChildren(
            m("label", "Resources"),
            ...user.items.map(item =>
                m("p", `${capitalize(item.name)}: ${item.amount}`)
            )
        )
    })
}

function SelectedHtml() {
    const el = document.getElementById("selected")!
    use(w => w.pawns[w.selectedPawn], (pawn: Pawn) => {
        if (!pawn) {
            el.style.display = "none";
            return
        } else {
            el.style.display = "";
        }

        el.replaceChildren(
            m("label", `Selected: ${capitalize(pawn.kind)} Pawn`),
            m("p", `Actions: ${pawn.actionsLeft}/${pawn.actionsFull}`),
            m("p", `Population: ${pawn.population}`),
            
            pawn.statuses.length === 0 ? "" :
                m("p", `Statues: ${pawn.statuses.join(", ")}`),
            
            ...getPawnActions(pawn).map(action =>
                button(
                    `${action.name} ${displayItems(action)}`,
                    () => pawnDoAction(pawn, action)
                )
            ),
        )
    })
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