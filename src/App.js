/*import Game from './game/Game'

export default Game*/

import React from "react"
import { initialize } from "./game/settings"

export default class App extends React.Component { 
  componentDidMount() {
    initialize()
  }

  render() {
    return <div>Hi!</div>
  }
}