import * as PIXI from "pixi.js";
import { Player } from "../classes/Player";

let player: Player;

export class GameApp {
  private app: PIXI.Application;

  constructor(parent: HTMLElement, width: number, height: number) {
    this.app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x000000,
    });
    parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

    player = new Player(this.app);
  }
}
