import { Game } from "./game/game.js";
import { View } from "./game/view.js";
import { Conrtoller } from "./game/controller.js";

const root = document.querySelector('#root')

const game = new Game()
const view = new View(root, 480, 640, 20, 10)
const controller = new Conrtoller(game, view)

window.game = game
window.view = view
window.controller = controller
